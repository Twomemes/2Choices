import { ClaimLock, ClaimLock__factory, Garden__factory, TwoToken__factory, TwoToken, ERC20__factory, MockToken__factory } from '~/typechain';
import { deployments, ethers, getUnnamedAccounts, network, upgrades } from 'hardhat';
import { expect } from './chai-setup';
import { deployAll } from '~/utils/deployer';
import { setupUsers } from './utils';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { printEtherResult } from '../utils/logutil';
import { getSigner } from '~/utils/contract';
import { toBuffer, fromUtf8, bufferToHex, zeroAddress } from 'ethereumjs-util';
import { BigNumber } from '@ethersproject/bignumber';
import delay from 'delay';

const setup = deployments.createFixture(async () => {
  const signer = await getSigner();
  const two = <TwoToken>await new TwoToken__factory(signer).deploy();

  const mockLp = await new MockToken__factory(signer).deploy('Mock LP', 'MOCK', 18, parseEther('100000000000000'));


  const currentBlock = (await signer.provider?.getBlockNumber()) as number;
  const farm = await new Garden__factory(signer).deploy(
    two.address,
    parseEther('1'),
    currentBlock,
    currentBlock + 100000 * 365,
    100000
  );

  //const mintRole = await two.MINTER();

  //await two.grantRole(mintRole, farm.address);
  //await two.grantRole(mintRole, signer.address);
  await mockLp.approve(farm.address, parseEther('100000000000000'));


  const lock = <ClaimLock>await upgrades.deployProxy(new ClaimLock__factory(signer), [farm.address, two.address]);

  await farm.setRewardLocker(lock.address);

  // await two.mint(signer.address, parseEther('100000'))

  const singers = await ethers.getSigners();
  const accounts = singers.map((e) => e.address);
  const users = await setupUsers(accounts, {
    two,
    farm,
    lock,
    mockLp,
  });

  return {
    users,
    two,
    farm,
    lock,
    mockLp,
  };
});

describe('garden', async () => {

  it('add pool', async () => {
    const { farm, mockLp } = await setup();

    await farm.addPool(3, mockLp.address);
    expect(await farm._totalAllocPoint()).to.eq(3);

  });

  it('add pool -> deposit', async () => {
    const { users, farm, mockLp } = await setup();

    await farm.addPool(3, mockLp.address);
    const value = parseEther('10.1');

    const lpBl = await mockLp.balanceOf(users[0].address);
    await farm.deposit(0, value);

    const lpBlAfter = await mockLp.balanceOf(users[0].address);
    expect(lpBlAfter).eq(lpBl.sub(value));

    expect((await farm._userInfo(0, users[0].address)).amount).to.eq(value);

  });
  it('add pool -> deposit -> emergencyWithdraw ', async () => {
    const { users, farm, mockLp } = await setup();

    await farm.addPool(3, mockLp.address);
    const value = parseEther('10.1');

    const lpBl = await mockLp.balanceOf(users[0].address);
    await farm.deposit(0, value);

    await expect(farm.emergencyWithdraw(0)).to.be.revertedWith('can not now');

    await farm.setCanEmergencyWithdraw(true);
    await farm.emergencyWithdraw(0);

  });
  it('add pool-> deposit -> harvest', async () => {
    const { users, farm, mockLp, two } = await setup();
    await farm.addPool(3, mockLp.address);
    const value = parseEther('10.1');
    await farm.deposit(0, value);

    await delay(5 * 1000);
    await farm.harvestAll();
    const twoBl = await two.balanceOf(users[0].address);
    expect(twoBl).gt(0);
  });

  it(`add pool-> deposit -> harvest -> withdraw`, async () => {

    const { users, farm, mockLp, two } = await setup();

    await farm.setGovVault(users[1].address);
    await farm.addPool(30, mockLp.address);
    const value = parseEther('10.1');
    await farm.deposit(0, value);

    await delay(5 * 1000);
    await farm.withdraw(0, value);
  });


});

import { Garden, ClaimLock, ClaimLock__factory, Garden__factory, TwoToken__factory, TwoToken, ERC20__factory, MockToken__factory } from '~/typechain';
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
  const two = <TwoToken>await upgrades.deployProxy(new TwoToken__factory(signer));

  const mockLp = await new MockToken__factory(signer).deploy('Mock LP', 'MOCK', 18, parseEther('100000000000000'));


  const currentBlock = (await signer.provider?.getBlockNumber()) as number;
  const farm = await new Garden__factory(signer).deploy(
    two.address,
    parseEther('1'),
    currentBlock,
    currentBlock + 100000 * 365,
    100000
  );

  const mintRole = await two.MINTER();

  await two.grantRole(mintRole, farm.address);
  await two.grantRole(mintRole, signer.address);
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

  it('squidGame mint', async () => {
    const { users, farm, mockLp, two } = await setup();

    await farm.setGovVault(users[1].address);
    await farm.addPool(30, mockLp.address);

    await farm.setSquidGameAllocPoint(50);
    const value = parseEther('10.1');
    await farm.setSquidGameContract(users[1].address);
    await delay(1 * 1000);

    await users[1].farm.squidPoolCalim(users[1].address);

    console.log(`_squidGameLastClaimBlockNumber : ${await farm._squidGameLastClaimBlockNumber()}`);

    const squidBl = await two.balanceOf(users[1].address)
    console.log(`squidBl : ${formatEther(squidBl)}`);
    expect(squidBl).gt(0);

  });

  it('set reward muiltiplie', async () => {

    const { farm } = await setup();

    const m = [31, 15, 14, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1]

    await farm.setRewardMultiplier(m);

    for (let i = 0; i < m.length; i++) {
      expect(await farm._rewardMultiplier(i)).eq(m[i])
    }
  })

  it('get multiplier', async () => {
    const { farm } = await setup();
    await farm.setEndBlockNumber(`1`.repeat(22));
    const signer = await getSigner();
    const oneDayBlock = await (await farm._oneDayBlocks()).toNumber();
    console.log(`oneDayBlock: ${oneDayBlock}`);
    const currentBlock = (await signer.provider?.getBlockNumber()) as number;
    console.log(`currentBlock: ${currentBlock})`);
    console.log(`startBlock: ${(await farm._startBlockNumber()).toNumber()}`);
    const multiplier = [32, 16, 14, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    const startBlock = await (await farm._startBlockNumber()).toNumber();
    for (let i = 0; i < multiplier.length; i++) {
      const block = i * 7 * oneDayBlock + startBlock + 1;
      expect(await farm.getWeekth(block), `${i} weekth`).to.eq(i);
      console.log(`${i} getMultiplier(${block - 1},${block})`);
      expect(await farm.getMultiplier(block - 1, block), `${i} getMultiplier(${block - 1},${block})`).to.eq(
        multiplier[i]
      );
    }
  });

  it(`withdraw percent`, async () => {
    const { farm } = await setup();
    const chainInfo = await farm.chainInfo();

    /***
     *
      0<x<=1 blcok      22%1block
      <x<=1H            5%
      1H<X<=1day        3%
      1 day<X<=3 day    1%
      3 day<X<=7 day    0.5%
      7 day<X<=14 day   0.1%
      x>14 day          0%
     */

    const oneDay = 24 * 3600;
    for (const item of [
      [chainInfo.timestamp, 10000 - 2200], // same block
      [chainInfo.timestamp.sub(3600 * 1), 10000 - 500], // 1 hours
      [chainInfo.timestamp.sub(3600 * 1).sub(1), 10000 - 300], //  1 hours and 1 second
      [chainInfo.timestamp.sub(24 * 3600 * 1), 10000 - 300], //  1 days
      [chainInfo.timestamp.sub(24 * 3600 * 1).sub(1), 10000 - 100], //  1 days and 1 second
      [chainInfo.timestamp.sub(3 * 24 * 3600 * 1), 10000 - 100], //  3 days
      [chainInfo.timestamp.sub(3 * 24 * 3600 * 1).sub(1), 10000 - 50], //  3 days  and 1 second
      [chainInfo.timestamp.sub(7 * 24 * 3600 * 1), 10000 - 50], //  7 days
      [chainInfo.timestamp.sub(7 * 24 * 3600 * 1).sub(1), 10000 - 10], //  7 days  and 1 second
      [chainInfo.timestamp.sub(14 * 24 * 3600 * 1), 10000 - 10], //  14 days
      [chainInfo.timestamp.sub(14 * 24 * 3600 * 1).sub(1), 10000], //  14 days and 1 second
    ]) {
      expect(await farm.withdrawPercent(item[0])).eq(item[1]);
    }
  });
});

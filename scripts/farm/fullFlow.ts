import { ERC20__factory, Garden, Garden__factory, TwoToken__factory, MockTwo__factory, TwoToken, ClaimLock } from '~/typechain';
import { claimLockContract, farmContract, getSigner, twoTokenContract } from '../../utils/contract';
import { parseEther } from 'ethers/lib/utils';
import { contractAddress } from '../../utils/contract';
import { printEtherResult, printEtherResultArray } from '../../utils/logutil';
import delay from 'delay';
import { addrs, deployTwo, deployClaimLock } from './cfg'


async function deploy() {

  const signer = await getSigner(0);
  const currentBlock = (await signer.provider?.getBlockNumber()) as number;

  const factory = new Garden__factory(signer);

  const oneDayBlock = Math.ceil((24 * 3600) / 0.88);

  const two = await deployTwo();

  console.log(`deploy two`);

  const instance = await factory.deploy(
    two.address,
    parseEther('1'),
    currentBlock + 10,
    currentBlock + oneDayBlock * 365 * 3,
    oneDayBlock
  );
  console.log(`farm deploy to: ${instance.address}`);

  const tx = await two.setFarm(instance.address);
  console.log(`set farm for two: ${tx.hash}`);
  await instance.deployed();
  const claimLock = await deployClaimLock(instance.address, two.address);

  return { farm: instance, two, claimLock };
}


async function config(farm: Garden, claimLock: ClaimLock) {
  console.log('start config');
  // const two = TwoToken__factory.connect(contractAddress.two, await getSigner());
  // const claimLock = await claimLockContract();

  const lp = await farm.addPool(92, addrs.lp);
  console.log(`add lp pool : ${lp.hash}`);
  await lp.wait();
  const wftm = await farm.addPool(5, addrs.wftm);
  console.log(`add wftm ${addrs.wftm} : ${wftm.hash}`);

  const addVirtualPool = await farm.addVirtualPool(contractAddress.squidGame, 3);
  console.log(`addVirtualPool 0 :${addVirtualPool.hash}`);

  const lock = await farm.setRewardLocker(claimLock.address);
  console.log(`set reward lock for farm ${claimLock.address}: ${lock.hash}`);
  const signer = await getSigner(1);

  const setFarmForLock = await claimLock.setFarmAdd(farm.address);
  console.log(`set farm for ${farm.address} lock: ${setFarmForLock.hash}`);

  const setGovVault = await farm.setGovVault("0x56558DDEF9bDff3C9bBf777ba891E71c3C09b76A");
  console.log(`setGovVault ${setGovVault.hash}`);
  console.log(`-------- end config  --------`);
}



async function deposit(farm: Garden) {
  const signer = await getSigner()
  // const lp = ERC20__factory.connect(addrs.lp, signer);
  const wftm = ERC20__factory.connect(addrs.wftm, signer);

  const allowannce = await wftm.allowance(signer.address, farm.address);
  if (allowannce.lt(parseEther('10000'))) {
    const appLp = await wftm.approve(farm.address, parseEther('100000000000000'));
    console.log(`approve wftm: ${appLp.hash}`);
    await appLp.wait();
  }

  const dtx = await farm.deposit(1, parseEther('0.0001'));
  console.log(`deposit ${dtx.hash}`);

  await dtx.wait();
}

async function withdraw(farm: Garden) {
  const signer = await getSigner()
  const user = await farm._userInfo(1, signer.address)

  const tx = await farm.withdraw(1, user.amount, { gasLimit: 500000 });
  console.log(`withdraw: ${tx.hash}`);
}

async function transferStaking(users: string[]) {
  const signer = await getSigner()
  const lp = ERC20__factory.connect(addrs.lp, signer);
  const wftm = ERC20__factory.connect(addrs.wftm, signer);

  const v = parseEther('1000000')
  for (const u of users) {
    const tx0 = await lp.transfer(u, v)
    console.log(`transfer lp to ${u}: ${tx0.hash}`);

    const tx1 = await wftm.transfer(u, v)
    console.log(` transfer wftm to ${u}: ${tx1.hash}`);
  }
}

async function harvest(farm: Garden) {
  const h = await farm.harvestAll({ gasLimit: 500000 });
  console.log(`harvest ${h.hash}`);
}

(async () => {
  const { farm, two, claimLock } = await deploy();

  // const farm = await farmContract();

  // await transferStaking(['0x7Fc4fdbBf6F4a16ca076e1Eca5364D6e9db68994'])
  // const two = await deployTwo();
  // const two = await twoTokenContract();

  await config(farm, claimLock);

  await deposit(farm);
  console.log(`wait 10s`);
  await delay(10 * 1000);
  await harvest(farm);
  console.log(`wait 10s`);
  await delay(10 * 1000);
  await withdraw(farm);

  const tx2 = await claimLock.claimFarmReward([0]);
  console.log(`claim farm reward: ${tx2.hash}`);
  const pool = await farm.poolInfo();
  printEtherResultArray(pool);
})();



import { ERC20__factory, Garden, Garden__factory } from '~/typechain';
import { claimLockContract, farmContract, getSigner, twoTokenContract } from '../../utils/contract';
import { parseEther } from 'ethers/lib/utils';
import { contractAddress } from '../../utils/contract';
import { printEtherResult, printEtherResultArray } from '../../utils/logutil';
import delay from 'delay';
import { addrs } from './cfg'


async function deploy() {

  const signer = await getSigner(0);
  const currentBlock = (await signer.provider?.getBlockNumber()) as number;

  const factory = new Garden__factory(signer);

  const oneDayBlock = Math.ceil((24 * 3600) / 0.88);

  const instance = await factory.deploy(
    contractAddress.two,
    parseEther('1'),
    currentBlock + 10,
    currentBlock + oneDayBlock * 365 * 3,
    oneDayBlock
  );

  console.log(`farm deploy to: ${instance.address}`);
  await instance.deployed();
  return instance;

}


async function config(farm: Garden) {

  const two = await twoTokenContract();

  const claimLock = await claimLockContract();

  const mintRole = await two.MINTER();


  const lp = await farm.addPool(23, addrs.lp);
  console.log(`add lp pool : ${lp.hash}`);
  const wftm = await farm.addPool(3, addrs.wftm);
  console.log(`add wftm: ${wftm.hash}`);

  const squidAlloc = await farm.setSquidGameAllocPoint(20);
  console.log(`squid alloc :${squidAlloc.hash}`);

  const lock = await farm.setRewardLocker(contractAddress.claimLock);
  console.log(`set reward lock: ${lock.hash}`);
  const signer = await getSigner(1);
  const setGovVault = await farm.setGovVault(signer.address);
  console.log(`setGovVault ${setGovVault.hash}`);
  const squidSetting = await farm.setSquidGameContract(contractAddress.squidGame);
  console.log(`squid game setting: ${squidSetting.hash}`);

  const setFarmForLock = await claimLock.setFarmAdd(farm.address);
  console.log(`set farm for lock: ${setFarmForLock.hash}`);
}



async function deposit(farm: Garden) {
  const signer = await getSigner()
  const lp = ERC20__factory.connect(addrs.lp, signer);
  const wftm = ERC20__factory.connect(addrs.wftm, signer);

  const allowannce = await lp.allowance(signer.address, farm.address);
  if (allowannce.lt(parseEther('10000'))) {
    const appLp = await lp.approve(farm.address, parseEther('100000000000000'));
    console.log(`approve lp: ${appLp.hash}`);
    await appLp.wait();
  }

  const dtx = await farm.deposit(0, parseEther('10'));
  console.log(`deposit ${dtx.hash}`);

  await dtx.wait();
}

async function withdraw(farm: Garden) {
  const signer = await getSigner()
  const user = await farm._userInfo(0, signer.address)

  const tx = await farm.withdraw(0, user.amount, { gasLimit: 500000 });
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
  const farm = await deploy();
  // const farm = await farmContract();

  // await transferStaking(['0x7Fc4fdbBf6F4a16ca076e1Eca5364D6e9db68994'])

  await config(farm);
  await deposit(farm);

  await delay(20 * 1000);
  await harvest(farm);
  await delay(20 * 1000);
  await withdraw(farm);
  const pool = await farm.poolInfo();
  printEtherResultArray(pool);
})();



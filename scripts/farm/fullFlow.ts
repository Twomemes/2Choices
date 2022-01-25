import { ERC20__factory, Garden, Garden__factory } from '~/typechain';
import { farmContract, getSigner } from '../../utils/contract';
import { parseEther } from 'ethers/lib/utils';
import { contractAddress } from '../../utils/contract';
import { printEtherResult, printEtherResultArray } from '../../utils/logutil';
import delay from 'delay';


const addrs = {
  wftm: '0x432247280466bf16537dcE5817b24Ee945F3E43E',
  lp: '0x8FCacfeFF8988c3e4792f585CCC148f67Ae29432',
};
async function deploy() {

  const signer = await getSigner(0);
  const currentBlock = (await signer.provider?.getBlockNumber()) as number;

  const factory = new Garden__factory(signer);

  const oneDayBlock = Math.ceil((24 * 3600) / 0.88);

  const instance = await factory.deploy(
    contractAddress.two,
    parseEther('1'),
    currentBlock + 100,
    currentBlock + oneDayBlock * 365 * 3,
    oneDayBlock
  );

  console.log(`farm deploy to: ${instance.address}`);
  await instance.deployed();
  return instance;

}


async function config(farm: Garden) {
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

  const tx = await farm.withdraw(0, user.amount)
  console.log(`withdraw: ${tx.hash}`);
}

async function harvest(farm: Garden) {
  const h = await farm.harvestAll();
  console.log(`harvest ${h.hash}`);

}

(async () => {
  // const farm = await deploy();
  const farm = await farmContract();
  // await config(farm);
  // await deposit(farm);

  // await delay(20 * 1000);
  await harvest(farm);
  await delay(20 * 1000);
  await withdraw(farm);
  const pool = await farm.poolInfo();
  printEtherResultArray(pool)
})();

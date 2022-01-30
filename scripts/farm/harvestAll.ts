import { farmContract, getSigner } from "../../utils/contract";
import { parseEther, formatEther } from 'ethers/lib/utils';


(async () => {
  const farm = await farmContract();
  const signer = await getSigner(0);

  const block = await signer.provider?.getBlockNumber() as number;

  const initLock = await farm.getInitRewardPercent(block);
  console.log(`init reward percent ${initLock.toNumber()/100}%`);
  const pend0 = await farm.pendingReward(0, signer.address);
  const pend1 = await farm.pendingReward(1, signer.address);
  console.log(`pool0: ${formatEther(pend0)}`);
  console.log(`pool1: ${formatEther(pend1)}`);
  console.log(`total pend: ${formatEther(pend1.add(pend0))}`);
  console.log(`total unlocked: ${formatEther(
    pend1.add(pend0).mul(22).div(100))
    }`);
  const tx = await farm.harvestAll();
  console.log(`tx  ${tx.hash}`);
})();

import { contractAddress, farmContract } from '~/utils/contract';
import { parseEther } from 'ethers/lib/utils';

(async () => {
  const farm = await farmContract();
  const tx1 = await farm.setRewardPerBlock(parseEther('10'))
  console.log(tx1.hash);
  const tx = await farm.setVirtualAllocPoint(1,200);
  console.log('set vp1 point', tx.hash);
})();

import { contractAddress, farmContract } from '~/utils/contract';
import { parseEther } from 'ethers/lib/utils';

(async () => {
  const farm = await farmContract();

  const tx = await farm.setSquidGameAllocPoint(30);
  console.log('set squid alloc point', tx.hash);


  const tx0 = await farm.setAllocPoint(0, 68);
  console.log(`setting lp alloc point ${tx0.hash}`);

  const tx1 = await farm.setAllocPoint(1, 2);
  console.log(`set wftm to ${tx1.hash}`);
})();

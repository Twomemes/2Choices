import { contractAddress, farmContract } from '~/utils/contract';
import { parseEther } from 'ethers/lib/utils';

(async () => {
  const farm = await farmContract();

  const squid = await farm._squidGameAllocPoint();

  const pool0 = await farm._poolInfo(0);
  const pool1 = await farm._poolInfo(1);


  console.log(`total: ${squid.add(pool0.allocPoint).add(pool1.allocPoint).toNumber()} squid: ${squid.toNumber()}  pool0: ${pool0.allocPoint.toNumber()}  pool1: ${pool1.allocPoint.toNumber()}`);
})();

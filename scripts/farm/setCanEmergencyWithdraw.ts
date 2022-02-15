import { contractAddress, farmContract } from '~/utils/contract';
import { parseEther } from 'ethers/lib/utils';

(async () => {
  const farm = await farmContract();

  const tx = await farm.setCanEmergencyWithdraw(true);
  console.log(`setCanEmergencyWithdraw ${tx.hash}`);
})();

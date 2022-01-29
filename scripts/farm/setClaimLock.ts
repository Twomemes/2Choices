import { contractAddress, farmContract } from '~/utils/contract';
import { parseEther } from 'ethers/lib/utils';

(async () => {
  const farm = await farmContract();

  const tx = await farm.setRewardLocker('0x23644B1cb0ea6433382ea2Df7BF2bf20f70Da880');
  console.log(tx.hash);
})();

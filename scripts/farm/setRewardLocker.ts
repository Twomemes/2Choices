import {contractAddress, farmContract} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const farm = await farmContract();

  const tx = await farm.setRewardLocker(contractAddress.claimLock);
  console.log(tx.hash);
})();

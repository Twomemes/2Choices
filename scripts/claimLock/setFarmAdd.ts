import {parseEther} from 'ethers/lib/utils';
import {contractAddress, claimLockContract} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const claimlock = await claimLockContract();
  const tx = await claimlock.setFarmAdd('0x4FF3b48a999F1b65B42b8fFd7f0F723121199Fdd');
  console.log(tx.hash);
})();

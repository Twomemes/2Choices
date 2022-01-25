import {parseEther} from 'ethers/lib/utils';
import {contractAddress, claimLockContract} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const claimlock = await claimLockContract();
  let a = await claimlock.getFarmAccInfo('0x0536FeBA0B99E770943B600746d6271a9D792702');
  console.log(a);
})();

import {parseEther} from 'ethers/lib/utils';
import {contractAddress, claimLockContract} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const claimlock = await claimLockContract();
  let a = await claimlock.claimFarmReward([1],{gasLimit:500000});
  console.log(a.hash);
})();

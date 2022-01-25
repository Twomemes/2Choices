import {parseEther} from 'ethers/lib/utils';
import {claimLockContract} from '~/utils/contract';
import {contractAddress} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const claimlock = await claimLockContract();
  const tx = await claimlock.setTradingAdd('!!!!!');
  console.log(tx.hash);
})();

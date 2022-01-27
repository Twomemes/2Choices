import {parseEther} from 'ethers/lib/utils';
import {contractAddress, claimLockContract} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const claimlock = await claimLockContract();
  const tx = await claimlock.setFarmAdd('0x293006B5a3620a5425cb115D25e13BAE0982dA44');
  console.log(tx.hash);
})();

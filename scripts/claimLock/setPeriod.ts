import { parseEther } from 'ethers/lib/utils';
import { contractAddress, claimLockContract } from "../../utils/contract";
import { formatEther } from 'ethers/lib/utils'

(async () => {
  const claimlock = await claimLockContract();
  const tx = await claimlock.setBlockNumber(7500);
  console.log(tx.hash);
})();
import { parseEther } from 'ethers/lib/utils';
import { contractAddress, claimLockContract } from "../../utils/contract";
import { formatEther } from 'ethers/lib/utils'

(async () => {
  const claimlock = await claimLockContract();
  const tx = await claimlock.setTreasury('0xAdCE766F4b29F603FdB25b97Cf27eF50d4d1a31F');
  console.log(tx.hash);
})();

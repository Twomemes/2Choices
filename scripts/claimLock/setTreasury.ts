import { parseEther } from 'ethers/lib/utils';
import { contractAddress, claimLockContract } from "../../utils/contract";
import { formatEther } from 'ethers/lib/utils'

(async () => {
  const claimlock = await claimLockContract();
  const tx = await claimlock.setTreasury('0xB9BA0B2FB9C3c98f8a40304D6316c1ddCca53CCA');
  console.log(tx.hash);
})();

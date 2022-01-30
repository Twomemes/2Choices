import { farmContract, getSigner } from "~/utils/contract";
import { parseEther, formatEther } from 'ethers/lib/utils';


(async () => {
  const farm = await farmContract();
  const signer = await getSigner(0);

  const tx = await farm.testClaimLock(signer.address, parseEther('0.0001'));
  console.log(`tx  ${tx.hash}`);
})();

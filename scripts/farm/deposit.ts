  import { farmContract } from "../../utils/contract";
import { parseEther } from 'ethers/lib/utils';


(async ()=>{
  const farm = await farmContract();
  const tx = await farm.deposit(0, parseEther('100'));
  console.log(`tx  ${tx.hash}`);
})();

import { farmContract } from "../../utils/contract";
import { parseEther } from 'ethers/lib/utils';


(async ()=>{
  const farm = await farmContract();
  const tx = await farm.deposit(1, parseEther('0.0001'));
  console.log(`tx  ${tx.hash}`);
})();

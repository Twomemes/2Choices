import { farmContract, getSigner, twoTokenContract } from "~/utils/contract";
import { parseEther, formatEther } from 'ethers/lib/utils';


(async () => {
  const farm = await farmContract();
  const signer = await getSigner(0);


  console.log(`farm.address  ${farm.address}`);
  console.log(`two in farm address  ${await farm._twoToken()}`);
  const two = await twoTokenContract();


  for(const k of [
'farmContract'
  ]){
    const v = await (<any>two)[k]()
    console.log(`${k} = ${v}`);
  }
  const tx = await farm.testMint(signer.address, parseEther('0.0001'));
  console.log(`tx  ${tx.hash}`);
})();

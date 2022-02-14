import {twoTokenContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';
import { contractAddress } from '../../utils/contract';


(async () => {
  const two = await twoTokenContract();

  //const tx = await kaki.mint(signer.address, parseEther('1'));
  /*const tx = await two.setAllowBuyAt(1644825600);
  console.log(tx.hash);


  const tx2 = await two.setMode(1);
  console.log(tx2.hash);
  
  const tx5 = await two.setSwapAddress('0xb5D0e466953aC291CABb2eB9E11866c50F1E269f');
  console.log(tx5.hash);*/

  const tx3 = await two.setMaxBuyAmount(0);
  console.log('MaxBuyAmount =0',tx3.hash);


  const tx4 = await two.setBuyDelayBlock(0);
  console.log(tx4.hash);

  
})();

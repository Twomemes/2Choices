import { contractAddress, blindBoxContract, kakiTicketContract,twoTokenContract } from './../../utils/contract';
import { getSigner } from '~/utils/contract';
import { parseEther } from 'ethers/lib/utils';

(async () => {
  const blindBox = await blindBoxContract();
  const two=await twoTokenContract();
  //await two.approve(blindBox.address,parseEther('100000'));
  const signer0 = await getSigner(0);
  // for (var i =0 ;i<20;i++){
  //   let a = await blindBox.getRand();
  //   console.log(a);
  // }
  const tx = await blindBox.bBoxOpen(10,{gasLimit:5000000} );
  //const ticket = await kakiTicketContract();

  console.log(tx.hash);
  
})();
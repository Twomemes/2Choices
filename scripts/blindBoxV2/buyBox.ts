import { contractAddress, blindBoxContract, kakiTicketContract } from './../../utils/contract';
import { getSigner } from '~/utils/contract';

(async () => {
  const blindBox = await blindBoxContract();
  const signer0 = await getSigner(0);
  // for (var i =0 ;i<20;i++){
  //   let a = await blindBox.getRand();
  //   console.log(a);
  // }
  const tx = await blindBox.bBoxOpen(1 , {gasLimit: 400000});
  //const ticket = await kakiTicketContract();

  console.log(tx);
  
})();
import { contractAddress, blindBoxContract } from './../../utils/contract';
import { getSigner } from '~/utils/contract';

(async () => {
  const blindBox = await blindBoxContract();
  const signer0 = await getSigner(0);
  // for (var i =95 ;i<105;i++){
  //   let a = await blindBox.getRand();
  //   console.log(a);
  // }
  let a = await blindBox.getrPr();
  console.log(a);
  
})();
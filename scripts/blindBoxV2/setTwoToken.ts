import { contractAddress, blindBoxContract } from './../../utils/contract';
import { getSigner } from '~/utils/contract';

(async () => {
  const blindBox = await blindBoxContract();
  const tx = await blindBox.setTWO(contractAddress.two,{gasLimit:300000});
  console.log(tx.hash);
})();
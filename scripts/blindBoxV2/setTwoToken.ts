import { contractAddress, blindBoxContract } from './../../utils/contract';
import { getSigner } from '~/utils/contract';

(async () => {
  const blindBox = await blindBoxContract();
  const tx = await blindBox.setTWO(contractAddress.two);
  console.log(tx.hash);
})();
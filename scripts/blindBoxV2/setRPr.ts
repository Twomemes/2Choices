import { contractAddress, blindBoxContract } from './../../utils/contract';
import { getSigner } from '~/utils/contract';

(async () => {
  const blindBox = await blindBoxContract();
  const signer0 = await getSigner(0);
  const tx = await blindBox.setRPr(1);
  console.log(tx.hash);
})();
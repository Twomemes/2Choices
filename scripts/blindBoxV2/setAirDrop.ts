import { contractAddress, blindBoxContract } from './../../utils/contract';
import { getSigner } from '~/utils/contract';

(async () => {
  const blindBox = await blindBoxContract();
  const tx = await blindBox.setAirDrop(contractAddress.airdrop);
  console.log(contractAddress.airdrop,tx.hash);
})();
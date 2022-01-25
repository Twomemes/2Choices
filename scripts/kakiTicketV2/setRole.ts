import { contractAddress, kakiTicketContract } from './../../utils/contract';
import { getSigner } from '~/utils/contract';

(async () => {
  const kakiTicket = await kakiTicketContract();
  const signer0 = await getSigner(0);
  const tx = await kakiTicket.setupAdmin(contractAddress.blindBox);
  console.log(tx.hash);
})();
import { contractAddress, kakiTicketContract } from './../../utils/contract';
import { getSigner } from '~/utils/contract';

(async () => {
  const kakiTicket = await kakiTicketContract();
  const signer0 = await getSigner(0);
  for (var i = 246; i<296;i++){
    let a = await kakiTicket.getTicketInfo(i);
    console.log(a);
  }
  
})();
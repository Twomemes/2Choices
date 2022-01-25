import {contractAddress} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import {Ticket__factory} from '~/typechain';

(async () => {
  await upgrade(`ticketV1/Ticket.sol`, contractAddress.squidTicket, Ticket__factory);
})();

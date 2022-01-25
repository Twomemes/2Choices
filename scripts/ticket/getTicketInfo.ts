import {parseEther} from 'ethers/lib/utils';
import {squidTicketContract} from '~/utils/contract';
import {formatEther} from 'ethers/lib/utils';
import {printEtherResult} from '~/utils/logutil';

(async () => {
  const ticket = await squidTicketContract();
  const t = await ticket.getTicketInfo(378);
  printEtherResult(t);
})();

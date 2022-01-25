import {parseEther} from 'ethers/lib/utils';
import {squidTicketContract} from '~/utils/contract';
import {busdContract, contractAddress} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const ticket = await squidTicketContract();
  const tx = await ticket.setupAdmin(contractAddress.squidOpenBox);
  console.log(tx.hash);
})();

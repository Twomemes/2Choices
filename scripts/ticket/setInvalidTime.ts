import {parseEther} from 'ethers/lib/utils';
import {contractAddress, squidTicketContract} from '~/utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const ticket = await squidTicketContract();
  console.log('ticket invalidate...');
  let a = [377];

  //const tx2=await ticket.setInvalidTime(a,0);
  // const tx2 = await allowList.setupAdmin('0x8B52aB88dF16f88c4Ec885D89889C6deCAc7E221');
  //console.log(tx2.hash);
})();

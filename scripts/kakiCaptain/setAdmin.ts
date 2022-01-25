import {parseEther} from 'ethers/lib/utils';
import {kakiCaptainContract} from '~/utils/contract';
import {contractAddress} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const ticket = await kakiCaptainContract();
  const tx = await ticket.setupAdmin(contractAddress.captainClaim);
  console.log(tx.hash);
})();

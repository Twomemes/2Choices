import {parseEther} from 'ethers/lib/utils';
import {kakiCaptainContract} from '~/utils/contract';
import {contractAddress} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const ticket = await kakiCaptainContract();
  let a = await ticket.tokenURI(577);
  console.log(a);
})();

import {parseEther} from 'ethers/lib/utils';
import {squidOpenBoxContract} from '~/utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const openBox = await squidOpenBoxContract();
  const price = await openBox._ticketPrice();

  console.log('_price', formatEther(price));
})();

import {parseEther} from 'ethers/lib/utils';
import {squidOpenBoxContract} from '~/utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const openBox = await squidOpenBoxContract();
  const tx = await openBox.setTicketPrice(parseEther('10'));
  console.log(tx.hash);
  await tx.wait();

  const price = await openBox._ticketPrice();

  console.log('_price', formatEther(price));
})();

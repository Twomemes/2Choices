import {contractAddress, squidOpenBoxContract, squidTicketContract} from '../../utils/contract';
import {formatEther, parseEther} from 'ethers/lib/utils';

(async () => {
  const openBox = await squidOpenBoxContract();
  const ticketContract = await squidTicketContract();
  //const tx=await openBox.setTicketPrice(parseEther('10'),{gasLimit:5000000});
  //console.log(tx.hash);
  /*const price= await openBox._ticketPrice();
  console.log('_price', formatEther(price));
  const tx2=await openBox.buyTicket(1,{gasLimit:5000000});
  console.log(tx2.hash);*/
  const tx2 = await openBox.claim({gasLimit: 5000000});
  console.log(tx2.hash);
  const tx = await ticketContract.balanceOf('0xd6D134377027b5d48535701e30Bc9198E69af592');
  console.log(tx.toString());
})();

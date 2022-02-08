import {twoTokenContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);

  //const tx = await kaki.mint(signer.address, parseEther('1'));
  const tx = await two.mint('0x0606490C870eD53c45c01D4CeD461A7d850220b3', parseEther('10000'));
  console.log(tx.hash);
})();

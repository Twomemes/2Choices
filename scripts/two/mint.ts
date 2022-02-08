import {twoTokenContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);

  //const tx = await kaki.mint(signer.address, parseEther('1'));
  const tx = await two.mint('0xc802a5c57028F7E45cFcA1fF6c26F6DA6695eb07', parseEther('100000000'));
  console.log(tx.hash);
})();

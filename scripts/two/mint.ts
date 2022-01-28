import {twoTokenContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);

  //const tx = await kaki.mint(signer.address, parseEther('1'));
  const tx = await two.mint('0xCA56Ce13Ccf24FF25aba1cb38Cf4aB5BD6498551', parseEther('100000000'));
  console.log(tx.hash);
})();

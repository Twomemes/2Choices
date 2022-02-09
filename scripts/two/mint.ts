import {twoTokenContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';
import { contractAddress } from '../../utils/contract';


(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);

  //const tx = await kaki.mint(signer.address, parseEther('1'));
  const tx = await two.mint('0xb4eD8d1Cee3DDF31b1C5b4aC31Fc99d55a9862b5', parseEther('10000'));
  console.log(tx.hash);
})();

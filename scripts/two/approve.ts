import {twoTokenContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);

  //const tx = await kaki.mint(signer.address, parseEther('1'));
  const tx = await two.approve("0x0B4eee1609aC91a26F0D080C229C9055C5A158f7", parseEther('100000'));
  console.log(tx.hash);
})();
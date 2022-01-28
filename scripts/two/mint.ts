import {twoTokenContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);

  //const tx = await kaki.mint(signer.address, parseEther('1'));
  const tx = await two.mint('0xD65A4930cB8812daDC069b110b782deA408869b2', parseEther('100000000'));
  console.log(tx.hash);
})();

import {twoTokenContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);

  //const tx = await kaki.mint(signer.address, parseEther('1'));
  const tx = await two.mint('0xEbB594b4E7aFC089A061434e21cE3A6e4edbC5d1', parseEther('100000'));
  console.log(tx.hash);
})();

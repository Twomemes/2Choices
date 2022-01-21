import { kakiContract, getSigner } from '~/utils/contract';
import { parseEther } from 'ethers/lib/utils';

(async () => {
  const kaki = await kakiContract();
  const signer = await getSigner(0);

  //const tx = await kaki.mint(signer.address, parseEther('1'));
  const tx = await kaki.mint("0xEbB594b4E7aFC089A061434e21cE3A6e4edbC5d1", parseEther('20200'));
  console.log(tx.hash);
})();

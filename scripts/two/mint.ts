import {twoTokenContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);

  //const tx = await kaki.mint(signer.address, parseEther('1'));
  const tx = await two.mint('0x208004343AC61BcE6530C1C58d09d81F83E0e521', parseEther('10000'));
  console.log(tx.hash);
})();

import {twoTokenContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);

  //const tx = await kaki.mint(signer.address, parseEther('1'));
  const tx = await two.mint('0xAdCE766F4b29F603FdB25b97Cf27eF50d4d1a31F', parseEther('100000'));
  console.log(tx.hash);
})();

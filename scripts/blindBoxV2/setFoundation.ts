import { contractAddress, blindBoxContract } from './../../utils/contract';
import { getSigner } from '~/utils/contract';

(async () => {
  const blindBox = await blindBoxContract();
  const signer0 = await getSigner(0);
  const tx = await blindBox.setFound("0xAdCE766F4b29F603FdB25b97Cf27eF50d4d1a31F");
  console.log(tx.hash);
})();
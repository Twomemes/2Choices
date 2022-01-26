import { farmContract, getSigner } from '~/utils/contract';
import { printEtherResultArray } from '../../utils/logutil';

(async () => {
  const farm = await farmContract();
  const signer = await getSigner(0);
  const user = await farm._userInfo(0, signer.address)
  const tx = await farm.emergencyWithdraw(0);

  console.log(`emergencyWithdraw ${tx.hash}`);

})();

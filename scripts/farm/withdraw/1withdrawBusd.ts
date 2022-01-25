import {farmContract, getSigner} from '~/utils/contract';
import {printEtherResult} from '../../../utils/logutil';

(async () => {
  const farm = await farmContract();
  const signer = await getSigner(0);

  const pid = 1;
  const user = await farm._userInfo(pid, signer.address);
  printEtherResult(user);
  const tx = await farm.withdraw(pid, 1, {gasLimit: 1000000});
  console.log(tx.hash);
})();

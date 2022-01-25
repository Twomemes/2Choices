import {farmContract, getSigner} from '~/utils/contract';
import {printEtherResult} from '../../../utils/logutil';

(async () => {
  const farm = await farmContract();
  const signer = await getSigner(0);

  const pid = 2;
  const user = await farm._userInfo(pid, signer.address);
  printEtherResult(user, 'user');

  const pool = await farm._poolInfo(pid);
  printEtherResult(pool, 'pool');
  const tx = await farm.withdraw(pid, 1, {gasLimit: 1000000});
  console.log(tx.hash);
})();

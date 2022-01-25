import {farmContract, getSigner} from '~/utils/contract';
import {printEtherResult} from '../../../utils/logutil';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const farm = await farmContract();
  const signer = await getSigner(0);

  const pid = 3;
  const user = await farm._userInfo(pid, signer.address);
  printEtherResult(user, 'user');

  const pool = await farm._poolInfo(pid);
  printEtherResult(pool, 'pool');
  const tx = await farm.withdraw(pid, parseEther('0.1'));
  console.log(tx.hash);
})();

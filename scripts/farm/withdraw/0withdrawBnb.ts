import {farmContract, getSigner} from '~/utils/contract';
import {printEtherResult} from '../../../utils/logutil';
import {formatEther, parseEther} from 'ethers/lib/utils';
import {IERC20__factory} from '~/typechain';

(async () => {
  const farm = await farmContract();
  const signer = await getSigner(0);
  const pid = 0;
  const user = await farm._userInfo(pid, signer.address);
  printEtherResult(user);
  const tx = await farm.withdraw(pid, parseEther('0.00001'), {gasLimit: 1000000});
  console.log(tx.hash);

  const pool = await farm._poolInfo(pid);
  printEtherResult(pool, 'pool');
  console.log(
    `debet bl ${formatEther(await IERC20__factory.connect(pool.debtToken, signer).balanceOf(signer.address))} `
  );
})();

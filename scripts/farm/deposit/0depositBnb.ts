import {farmContract, getSigner} from '~/utils/contract';
import {parseEther, formatEther} from 'ethers/lib/utils';
import {printEtherResult} from '~/utils/logutil';
import {IERC20__factory} from '~/typechain';

(async () => {
  const farm = await farmContract();

  const pid = 0;

  const pool = await farm._poolInfo(pid);
  printEtherResult(pool, 'pool');
  const signer = await getSigner(0);

  const v = parseEther('0.1');
  const ov = {value: v};
  const tx = await farm.deposit(pid, v, ov);
  console.log(tx.hash);
  console.log(
    `debet bl ${formatEther(await IERC20__factory.connect(pool.debtToken, signer).balanceOf(signer.address))} `
  );
})();

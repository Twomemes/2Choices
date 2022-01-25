import {parseEther} from 'ethers/lib/utils';
import {squidOpenBoxContract} from '~/utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  console.log('set Invalid time!');
  const openBox = await squidOpenBoxContract();
  const tx = await openBox.setInvalidTime(1642039200); //2021-12-29 10:00:00
  console.log(tx.hash);

  let l = await openBox._invalidTime();
  console.log(l.toString());
})();

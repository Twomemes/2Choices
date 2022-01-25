import {farmContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';
import {printEtherResult} from '../../utils/logutil';
import delay from 'delay';

(async () => {
  const farm = await farmContract();
  const signer = await getSigner(1);
  const farm1 = farm.connect(signer);
  const user = await farm1._userInfo(0, signer.address);
  printEtherResult(user);

  const pending = await farm1.pendingReward(0);

  printEtherResult(pending, 'pending');
  const tx = await farm1.harvest(0);
  console.log(tx.hash);
  await tx.wait();

  await delay(5000);
  const user1 = await farm1._userInfo(0, signer.address);
  printEtherResult(user1);
})();

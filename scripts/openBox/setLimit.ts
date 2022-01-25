import {parseEther} from 'ethers/lib/utils';
import {squidOpenBoxContract} from '~/utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const openBox = await squidOpenBoxContract();
  //const tx = await openBox.setClaimLimit(1);
  //console.log(tx.hash);
  //await tx.wait();

  const limit = await openBox._claimLimit();

  console.log('_claimLimit', limit.toString());
})();

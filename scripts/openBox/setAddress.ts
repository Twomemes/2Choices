import {parseEther} from 'ethers/lib/utils';
import {contractAddress, squidOpenBoxContract} from '~/utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const openBox = await squidOpenBoxContract();
  const tx = await openBox.setClaimWhiteList(contractAddress.squidAllowList);
  console.log(tx.hash);
  await tx.wait();
})();

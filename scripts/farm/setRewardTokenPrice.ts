import {contractAddress, farmContract} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const farm = await farmContract();

  const tx = await farm.setRewardTokenPrice(8000);
  console.log(tx.hash);
})();

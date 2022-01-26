import {contractAddress, farmContract} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const farm = await farmContract();

  const tx = await farm.setSquidGameContract(contractAddress.squidGame);
  console.log(tx.hash);
})();

import {contractAddress, farmContract} from '~/utils/contract';
import {printEtherResultArray} from '~/utils/logutil';

(async () => {
  const farm = await farmContract();

  const tx = await farm.addVirtualPool(contractAddress.facet, 10);

  console.log(tx.hash);
})();

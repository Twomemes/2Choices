import {contractAddress, farmContract, getSigner} from '~/utils/contract';
import {printEtherResultArray} from '~/utils/logutil';

(async () => {
  const farm = await farmContract();

  const signer = await getSigner(0);

  const tx = await farm.addVirtualPool(signer.address, 3518);

  console.log(tx.hash);
})();

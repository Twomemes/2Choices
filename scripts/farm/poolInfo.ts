import {farmContract} from '~/utils/contract';
import {printEtherResultArray} from '../../utils/logutil';

(async () => {
  const farm = await farmContract();

  const pool = await farm.virtualPoolInfo();

  printEtherResultArray(pool);
})();

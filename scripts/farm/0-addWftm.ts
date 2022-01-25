import {farmContract} from '../../utils/contract';

(async () => {
  const farm = await farmContract();
  const tx = await farm.addPool(5, '0x432247280466bf16537dcE5817b24Ee945F3E43E');
  console.log(`add wftm ${tx.hash}`);
})();

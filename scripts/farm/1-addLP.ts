import {farmContract} from '../../utils/contract';

(async () => {
  const farm = await farmContract();
  const tx = await farm.addPool(30, '0x8FCacfeFF8988c3e4792f585CCC148f67Ae29432');
  console.log(`add wftm ${tx.hash}`);
})();

import {farmContract} from '../../utils/contract';

(async () => {
  const farm = await farmContract();
  const tx = await farm.addPool(92, '0xea33ab5e4a745b90403d8c8260ea32ba6278f92f');
  console.log(`add wftm ${tx.hash}`);
})();

import {contractAddress, squidGameContract} from '../../utils/contract';

(async () => {
  const squidGame = await squidGameContract();
  const tx = await squidGame.setFarm(contractAddress.farm);
  console.log(tx.hash);
})();

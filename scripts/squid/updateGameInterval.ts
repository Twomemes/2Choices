import {contractAddress, squidGameContract} from '../../utils/contract';

(async () => {
  const squidGame = await squidGameContract();
  const tx = await squidGame.updateGameInterval(28800*2);
  console.log(tx.hash);
})();

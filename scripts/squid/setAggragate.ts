import {contractAddress, squidGameContract} from '../../utils/contract';

(async () => {
  const squidGame = await squidGameContract();
  const tx = await squidGame.setAggregateContract(contractAddress.oracle);
  console.log(tx.hash);
})();

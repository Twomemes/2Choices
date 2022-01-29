import {contractAddress, squidGameContract} from '../../utils/contract';

(async () => {
  const squidGame = await squidGameContract();
  const tx = await squidGame.setTwoToken(contractAddress.two);
  console.log(tx.hash);
})();

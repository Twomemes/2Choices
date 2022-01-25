import {contractAddress, squidGameContract} from '../../utils/contract';

(async () => {
  const squidGame = await squidGameContract();
  const tx = await squidGame.setKakiPayWallet('0xe206189Dc09C52a32630A972B33b911205B45F89');
  console.log(tx.hash);
})();

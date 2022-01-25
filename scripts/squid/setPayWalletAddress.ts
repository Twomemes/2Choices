import {parseEther} from 'ethers/lib/utils';
import {busdContract, contractAddress, getSigner, squidGameContract} from '../../utils/contract';

(async () => {
  const squidGame = await squidGameContract();
  const signer0 = await getSigner(0);
  const tx = await squidGame.setKakiPayWallet(signer0.address);
  console.log(tx.hash);

  const usdt = await busdContract();
  const tx2 = await usdt.approve(squidGame.address, parseEther(`1000000`));
  console.log(`approve squid game : ${tx2.hash}`);
})();

import {parseEther} from 'ethers/lib/utils';
import {busdContract, contractAddress, getSigner, squidGameContract,twoTokenContract} from '../../utils/contract';

(async () => {
  const squidGame = await squidGameContract();
  const two = await twoTokenContract();

  /*const signer0 = await getSigner(0);
  console.log(signer0.address);
  const tx = await squidGame.setKakiPayWallet(signer0.address);
  console.log(tx.hash);*/

 
  const tx2 = await two.approve(squidGame.address, parseEther(`100000000`));
  console.log(tx2.hash);
})();

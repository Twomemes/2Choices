import {parseEther} from 'ethers/lib/utils';
import {busdContract, contractAddress, getSigner, squidGameContract} from '../../utils/contract';

(async () => {
  const squidGame = await squidGameContract();
  const tx = await squidGame._kakiPayWalletAddress();
  console.log(tx);
})();

import {getSigner, toolsContract} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const tools = await toolsContract();
  const bnbVault = '0xf9d32C5E10Dd51511894b360e6bD39D7573450F9';
  const busdVault = '0xe5ed8148fE4915cE857FC648b9BdEF8Bb9491Fa5';
  const value = parseEther('0.1');

  const signer = await getSigner(0);
  const tx = await signer.sendTransaction({ to: tools.address, value });
  console.log(tx.hash);

})();

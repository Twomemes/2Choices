import {toolsContract} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const tools = await toolsContract();
  const bnbVault = '0xf9d32C5E10Dd51511894b360e6bD39D7573450F9';
  const busdVault = '0xe5ed8148fE4915cE857FC648b9BdEF8Bb9491Fa5';

  const busdAddr = '0x0266693f9df932ad7da8a9b44c2129ce8a87e81f';

  const tx = await tools.approve(busdAddr, busdVault);
  console.log(tx.hash);

  //const tx = await tools.depositAndWithdraw(vault, parseEther('0.1'), false)
})();

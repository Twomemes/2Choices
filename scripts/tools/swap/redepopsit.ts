import { toolsContract, getSigner, twoTokenContract } from '~/utils/contract';
import { parseEther, formatEther } from 'ethers/lib/utils';
import { IERC20__factory } from '~/typechain';
import { contractAddress } from '~/utils/contract';

(async () => {
  const tools = await toolsContract();
  const signer = await getSigner();

  const two = await twoTokenContract();
  // const twoV = parseEther('100');
  const twoV = await two.balanceOf(tools.address);
  const ftmV = await tools.convertToFtm(twoV);
  console.log(`ftmV: ${formatEther(ftmV)}`);
  const tx = await tools.reDeposit();
  console.log(tx.hash);
})();

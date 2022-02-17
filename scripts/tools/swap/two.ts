import { toolsContract, getSigner } from '~/utils/contract';
import { parseEther, formatEther } from 'ethers/lib/utils';
import { IERC20__factory } from '~/typechain';
import { contractAddress } from '~/utils/contract';

(async () => {
  const tools = await toolsContract();
  const signer = await getSigner();
  const twoV = parseEther('100');
  const ftmV = await tools.convertToFtm(twoV);
  console.log(`ftmV: ${formatEther(ftmV)}`);
  const amounts = await tools.getTwoAmountsIn(twoV);

  for(const a of amounts) {
    console.log(`${formatEther(a)}`);
  }
  const tx = await tools.swapTwo(twoV, { value: ftmV.mul(10) , gasLimit: 500000 });
  console.log(tx.hash);
})();

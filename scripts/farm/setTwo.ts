import { contractAddress, farmContract } from '~/utils/contract';
import { parseEther } from 'ethers/lib/utils';

(async () => {
  const farm = await farmContract();

  const tx = await farm.setTwoToken(contractAddress.two);
  console.log(`set two ${contractAddress.two} fro farm : ${farm.address} ${tx.hash}`);
})();

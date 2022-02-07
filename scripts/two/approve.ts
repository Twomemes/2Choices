import {twoTokenContract, getSigner, contractAddress} from '~/utils/contract';
import { parseEther, formatEther } from 'ethers/lib/utils';

(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);

  console.log(`bl: ${formatEther(await two.balanceOf(signer.address))}`);

  const tx = await two.mint(signer.address, parseEther('1000000'));
  // const tx = await two.approve(contractAddress.airdrop, parseEther('1000000000000000000000000000'));
  console.log(tx.hash);
})();

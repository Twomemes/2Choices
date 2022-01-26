import {parseEther} from 'ethers/lib/utils';
import {contractAddress, twoTokenContract} from '../../utils/contract';

(async () => {
  const two = await twoTokenContract();
  const tx = await two.approve(contractAddress.squidGame, parseEther(`100000000`));

  console.log(tx.hash);
})();

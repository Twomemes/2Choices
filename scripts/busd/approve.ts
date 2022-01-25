import {parseEther} from 'ethers/lib/utils';
import {busdContract, contractAddress} from '../../utils/contract';

(async () => {
  const busd = await busdContract();
  const tx = await busd.approve(contractAddress.squidOpenBox, parseEther(`1000000`));

  console.log(tx.hash);
})();

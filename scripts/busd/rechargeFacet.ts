import {parseEther} from 'ethers/lib/utils';
import {busdContract} from '~/utils/contract';
import {contractAddress} from '../../utils/contract';

(async () => {
  const busd = await busdContract();
  const tx = await busd.transfer(contractAddress.facet, parseEther(`20000000`));
  console.log(tx.hash);
})();

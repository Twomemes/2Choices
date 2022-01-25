import {parseEther} from 'ethers/lib/utils';
import {busdContract} from '~/utils/contract';

(async () => {
  const busd = await busdContract();
  const tx = await busd.transfer('0xd6D134377027b5d48535701e30Bc9198E69af592', parseEther(`10000000`));
  console.log(tx.hash);
})();

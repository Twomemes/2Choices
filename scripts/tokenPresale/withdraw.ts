import {parseEther} from 'ethers/lib/utils';
import { tokenPresaleContract} from '../../utils/contract';

(async () => {
  const contract = await tokenPresaleContract();
  const ax = await contract.withdrawTwo();

  console.log(ax.hash);
})();

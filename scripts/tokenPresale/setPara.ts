import {parseEther} from 'ethers/lib/utils';
import { tokenPresaleContract} from '../../utils/contract';

(async () => {
  const contract = await tokenPresaleContract();
  const ax = await contract.setSaleStartStamp(1644224400);

  console.log(ax.hash);
  const ax2 = await contract.setSalePeriod(86400*3);

  console.log(ax2.hash);
})();

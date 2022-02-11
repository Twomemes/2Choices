import {parseEther} from 'ethers/lib/utils';
import { tokenPresaleContract} from '../../utils/contract';

(async () => {
  const contract = await tokenPresaleContract();
  const ax = await contract.setSaleStartStamp(1644814800);
  console.log(ax.hash);
  const ax2 = await contract.setSalePeriod(2400);
  console.log(ax2.hash);
  const ax3 = await contract.setWLSalePeriod(1200);
  console.log(ax3.hash);

})();

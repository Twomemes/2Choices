import {parseEther} from 'ethers/lib/utils';
import { tokenPresaleContract} from '../../utils/contract';

(async () => {
  const contract = await tokenPresaleContract();
  let amount = await contract.getLeftAmount();

  console.log(amount);
})();

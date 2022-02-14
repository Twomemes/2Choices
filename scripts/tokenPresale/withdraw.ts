import {parseEther} from 'ethers/lib/utils';
import { tokenPresaleContract} from '../../utils/contract';

(async () => {
  const contract = await tokenPresaleContract();
  let tx = await contract.withdraw();

  console.log(tx);
})();

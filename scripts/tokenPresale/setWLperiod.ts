import {parseEther} from 'ethers/lib/utils';
import { tokenPresaleContract} from '../../utils/contract';
import { getSigner } from '~/utils/contract';

(async () => {
  const contract = await tokenPresaleContract();
  const signer0 = await getSigner(0);
  let amount = await contract.setWLSalePeriod(9000);

  console.log(amount);
})();
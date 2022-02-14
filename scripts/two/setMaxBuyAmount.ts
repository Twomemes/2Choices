import {twoTokenContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';
import { contractAddress } from '../../utils/contract';


(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);
  const tx = await two.setMaxBuyAmount(parseEther('1000000'));

  console.log(tx.hash);
})();

import {twoTokenContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';
import { contractAddress } from '../../utils/contract';


(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);
  const tx = await two.setSwapAddress('0xea33ab5e4a745b90403d8c8260ea32ba6278f92f');

  console.log(tx.hash);
})();

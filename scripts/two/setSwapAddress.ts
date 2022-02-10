import {twoTokenContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';
import { contractAddress } from '../../utils/contract';


(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);
  const tx = await two.setSwapAddress('0x87d003af8b0bf6a67f31f6e02c73665dfea71ff2');

  console.log(tx.hash);
})();

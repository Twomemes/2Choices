import {twoTokenContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';
import { contractAddress } from '../../utils/contract';

(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);
  // const tx = await two.setFarm(contractAddress.farm);
  const tx = await two.setFarm(signer.address);
  console.log(tx.hash);
})();

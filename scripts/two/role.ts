import {twoTokenContract, contractAddress} from './../../utils/contract';
import {getSigner} from '~/utils/contract';

(async () => {
  const two = await twoTokenContract();
  const mintRole = await two.MINTER();
  const signer0 = await getSigner(0);
  // const tx = await two.grantRole(mintRole, signer0.address);
  const tx = await two.grantRole(mintRole, contractAddress.farm);
  console.log(tx.hash);
})();

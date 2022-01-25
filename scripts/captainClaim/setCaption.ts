import {parseEther} from 'ethers/lib/utils';
import {captainClaimContract} from '~/utils/contract';
import {contractAddress} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  console.log('setCaption');
  const claim = await captainClaimContract();
  const tx = await claim.setCapAdd(contractAddress.kakiCaptain);
  console.log(tx.hash);
})();

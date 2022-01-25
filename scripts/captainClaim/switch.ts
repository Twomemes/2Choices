import {parseEther} from 'ethers/lib/utils';
import {captainClaimContract} from '~/utils/contract';
import {contractAddress} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const captain = await captainClaimContract();
  const tx = await captain.switchByBox(113);
  console.log(tx.hash);
})();

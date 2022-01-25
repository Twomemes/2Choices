import {parseEther} from 'ethers/lib/utils';
import {captainClaimContract} from '~/utils/contract';
import {contractAddress} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';
import {captureRejections} from 'events';

(async () => {
  const captain = await captainClaimContract();
  //const tx = await captain.setFoundAdd('0x6Bf785c58ed36f50Fc81ee7Ab014b4a76da11f1A');
  //console.log(tx.hash);
  const address1 = await captain._kakiFoundation();
  console.log(address1);
})();

import {parseEther} from 'ethers/lib/utils';
import {mysteryBoxContract} from '../../utils/contract';
import {contractAddress} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const mBox = await mysteryBoxContract();
  const tx = await mBox.setApprovalForAll(contractAddress.captainClaim, true);
})();

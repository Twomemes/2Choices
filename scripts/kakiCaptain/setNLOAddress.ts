import {parseEther} from 'ethers/lib/utils';
import {kakiCaptainContract} from '~/utils/contract';
import {contractAddress} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const caption = await kakiCaptainContract();
  const tx = await caption.setNLOAddress('0xc81CCa62FDF3C48EF483CE965CBe45673aF5C49b');
  console.log(tx.hash);
  const adress2 = await caption.nloAddress();
  console.log(adress2);
})();

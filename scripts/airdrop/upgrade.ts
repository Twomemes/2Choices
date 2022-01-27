import {KakiSquidGame__factory} from '~/typechain';
import {contractAddress} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';

(async () => {
  
  await upgrade(`airdrop/Airdrop.sol`, contractAddress.airdrop);

})();

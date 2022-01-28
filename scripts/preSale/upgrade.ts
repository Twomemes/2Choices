import {KakiSquidGame__factory} from '~/typechain';
import {contractAddress} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';

(async () => {
  
  await upgrade(`presale/PreSale.sol`, contractAddress.preSale);

})();
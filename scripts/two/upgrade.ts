import {upgrade} from '~/utils/upgrader';
import {contractAddress} from '~/utils/contract';

(async () => {
  await upgrade(`two/TwoToken.sol`, contractAddress.two);
})();

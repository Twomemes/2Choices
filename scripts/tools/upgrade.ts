import {upgrade} from '~/utils/upgrader';
import {contractAddress} from '~/utils/contract';

(async () => {
  await upgrade(`mock/Tools.sol`, contractAddress.tools);
})();

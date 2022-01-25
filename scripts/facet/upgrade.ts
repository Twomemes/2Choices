import {deploy, upgrade} from '~/utils/upgrader';
import {contractAddress} from '../../utils/contract';

(async () => {
  await upgrade(`facet/Facet.sol`, contractAddress.facet);
})();

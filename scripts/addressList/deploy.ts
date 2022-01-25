import {deployAddrssList} from '../../utils/deployer';
import {deploy} from '~/utils/upgrader';

(async () => {
  await deploy(`base/AddressList.sol`);
})();

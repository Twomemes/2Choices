
import {Airdrop} from '~/typechain';
import {deploy} from '~/utils/upgrader';

(async () => {

  await deploy(`adminLock/AdminLock.sol`);
})();

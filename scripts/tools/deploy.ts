import {deploy} from '~/utils/upgrader';

(async () => {
  await deploy(`mock/Tools.sol`,[],null,false);
})();

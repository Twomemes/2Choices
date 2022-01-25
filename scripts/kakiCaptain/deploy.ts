import {deployKakiCaptain} from '~/utils/deployer';
import {KakiCaptain} from '~/typechain';
import {deploy} from '~/utils/upgrader';
import {getSigner} from '~/utils/contract';

(async () => {
  const signer = await getSigner(0);
  // await deployKakiCaptain();
  await deploy('captain/KakiCaptain.sol');
})();

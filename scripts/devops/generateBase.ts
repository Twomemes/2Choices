import {TwoToken__factory} from '~/typechain';
import {getSigner} from '~/utils/contract';
import {upgrades} from 'hardhat';

(async () => {
  const signer = await getSigner(0);
  const factory = new TwoToken__factory(signer);

  const instance = await upgrades.deployProxy(factory);
  console.log(`two deployed to: ${instance.address}`);
})();

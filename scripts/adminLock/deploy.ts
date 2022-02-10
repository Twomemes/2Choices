
import {Airdrop} from '~/typechain';
import {AdminLock, AdminLock__factory} from '~/typechain';
import {getSigner} from '../../utils/contract';
import {contractAddress} from '../../utils/contract';
import {deploy} from '~/utils/upgrader';

(async () => {

  const signer = await getSigner(0);

  const factory = new AdminLock__factory(signer);


  const instance = await factory.deploy(
    "0x8FCacfeFF8988c3e4792f585CCC148f67Ae29432",
    contractAddress.farm,
    contractAddress.two
  );

  console.log(`deploy to: ${instance.address}`);
})();

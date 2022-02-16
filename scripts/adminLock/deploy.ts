
import {Airdrop} from '~/typechain';
import {AdminLock, AdminLock__factory} from '~/typechain';
import {getSigner} from '../../utils/contract';
import {contractAddress} from '../../utils/contract';
import {deploy} from '~/utils/upgrader';

(async () => {

  const signer = await getSigner(0);

  const factory = new AdminLock__factory(signer);


  const instance = await factory.deploy(
    "0xb5D0e466953aC291CABb2eB9E11866c50F1E269f",
    contractAddress.farm,
    contractAddress.two,
    contractAddress.claimLock
  );

  console.log(`deploy to: ${instance.address}`);
})();

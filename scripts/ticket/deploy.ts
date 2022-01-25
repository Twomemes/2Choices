import {getSigner} from '~/utils/contract';
import {deployTicket} from '../../utils/deployer';

(async () => {
  const signer = await getSigner(0);
  console.log('deployer:', signer.address);
  await deployTicket();
})();

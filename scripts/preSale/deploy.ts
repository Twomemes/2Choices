
import { getSigner } from '~/utils/contract';
import {Presale__factory} from '~/typechain';

(async () => {
  const signer0 = await getSigner(0);
  const factory = new Presale__factory(signer0);
  const tx = await factory.deploy();
  console.log(`deploy  presale to: ${tx.address}`);
})();

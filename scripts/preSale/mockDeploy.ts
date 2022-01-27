
import { getSigner } from '~/utils/contract';
import {MockPreSale__factory} from '~/typechain';

(async () => {
  const signer0 = await getSigner(0);
  const factory = new MockPreSale__factory(signer0);
  const tx = await factory.deploy();
  console.log(`deploy  presale to: ${tx.address}`);
})();

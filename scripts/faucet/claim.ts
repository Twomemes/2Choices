import { Faucet__factory } from '~/typechain';
import { contractAddress, getSigner } from '../../utils/contract';

(async () => {
  const signer = await getSigner();


  const faucet = Faucet__factory.connect(contractAddress.facet, signer);

  const tx = await faucet.faucet();

  console.log(tx.hash);
})();



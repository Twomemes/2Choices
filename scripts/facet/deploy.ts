import {deploy} from '~/utils/upgrader';
import {Facet} from '~/typechain';
import {contractAddress} from '../../utils/contract';
(async () => {
  const args: Parameters<Facet['initialize']> = [contractAddress.busd];
  await deploy(`facet/Facet.sol`, args);
})();

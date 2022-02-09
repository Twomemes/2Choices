import { deploy } from '~/utils/upgrader';
import { Faucet } from '~/typechain';
import { contractAddress } from '../../utils/contract';
(async () => {
  const args: Parameters<Faucet['initialize']> = [contractAddress.farm, contractAddress.two];
  await deploy(`faucet/Faucet.sol`, args);
})();

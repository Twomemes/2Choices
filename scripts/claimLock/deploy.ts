import {contractAddress} from '~/utils/contract';
import {ClaimLock} from '~/typechain';
import {deploy} from '~/utils/upgrader';
(async () => {
  const args: Parameters<ClaimLock['initialize']> = [contractAddress.farm, contractAddress.two];

  console.log({args});
  await deploy(`claimLock/ClaimLock.sol`, args);
})();

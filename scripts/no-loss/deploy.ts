import {contractAddress} from '~/utils/contract';
import {KakiNoLoss} from '~/typechain';
import {deploy} from '~/utils/upgrader';
(async () => {
  const args: Parameters<KakiNoLoss['initialize']> = [
    contractAddress.kakiCaptain,
    contractAddress.kaki,
    contractAddress.busd,
    contractAddress.busd,
    contractAddress.busd,
    contractAddress.busd,
    contractAddress.oracle,
  ];

  await deploy(`no-loss/KakiNoLoss.sol`, args);
})();

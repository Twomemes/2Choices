
import {Airdrop} from '~/typechain';
import {deploy} from '~/utils/upgrader';

(async () => {
  const args: Parameters<Airdrop['initialize']> = [
    '0xadce766f4b29f603fdb25b97cf27ef50d4d1a31f'
  ];
  await deploy(`airdrop/Airdrop.sol`,args);
})();


import {Airdrop} from '~/typechain';
import {deploy} from '~/utils/upgrader';

(async () => {
  const args: Parameters<Airdrop['initialize']> = [
    '0xcbD85865d39C7bcB6A67A436A5e4E7127479657A'
  ];
  await deploy(`airdrop/Airdrop.sol`,args);
})();

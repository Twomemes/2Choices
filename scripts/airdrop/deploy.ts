import { contractAddress, getSigner } from '~/utils/contract';

import { Airdrop } from '~/typechain';
import { deploy } from '~/utils/upgrader';

(async () => {

  const signer0 = await getSigner(0);

  const args: Parameters<Airdrop['initialize']> = [
    '0xadce766f4b29f603fdb25b97cf27ef50d4d1a31f',
    '0xa525bC8E6eeaB54b3e35cAaFa3C3Bc04228096eD',
    '0x9f1851f29374efb292cfa78503fc02a9b640c45b',
  ];
  await deploy(`airdrop/Airdrop.sol`, args, null, false);
})();

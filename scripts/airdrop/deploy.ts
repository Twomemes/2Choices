import { contractAddress, getSigner } from '~/utils/contract';

import { Airdrop } from '~/typechain';
import { deploy } from '~/utils/upgrader';

(async () => {

  const signer0 = await getSigner(0);

  const args: Parameters<Airdrop['initialize']> = [
    '0xadce766f4b29f603fdb25b97cf27ef50d4d1a31f',
    '0xcBe6952d500E892Ed403894a8Dd06134daE9BD81',
    contractAddress.two,
  ];
  await deploy(`airdrop/Airdrop.sol`, args, null, false);
})();

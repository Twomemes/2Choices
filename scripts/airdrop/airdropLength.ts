

import { Airdrop__factory } from '~/typechain';
import { contractAddress, airdropContract } from '~/utils/contract';
import { upgrade } from '~/utils/upgrader';
import { getSigner } from '~/utils/contract';
import { printEtherResultArray } from '../../utils/logutil';


(async () => {
  const airdrop = await airdropContract();
  let a = await airdrop.getAirdrops();

  printEtherResultArray(a);
  console.log(a.length);
})();




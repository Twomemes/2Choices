import { Airdrop__factory } from '~/typechain';
import { contractAddress, airdropContract } from '~/utils/contract';
import { upgrade } from '~/utils/upgrader';
import { getSigner } from '~/utils/contract';
import { printEtherResultArray } from '../../utils/logutil';


(async () => {
  const airdrop = await airdropContract();
  let a = await airdrop._claimList(0, "0x62b293CF6170C76ea908689f2eb93eB21e3f5084");

  console.log(a);
})();
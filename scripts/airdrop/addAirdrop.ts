

import { Airdrop__factory } from '~/typechain';
import { contractAddress, airdropContract } from '~/utils/contract';
import { upgrade } from '~/utils/upgrader';
import { getSigner } from '~/utils/contract';


(async () => {
  const airdrop = await airdropContract();

  // let a = await airdrop.addAirdrop({
  //   remain: 100,
  //   total: 0,
  //   count: 0,
  //   startTime: Math.ceil(Date.now() / 1000 - 4 * 24 * 3600),
  //   endTime: Math.ceil(Date.now() / 1000 - 1 * 24 * 3600),
  //   desc: `*Make sure you've completed tasks in Discord or Gleam.
  //     *You can claim 50 $TWO token per campaign.
  //     *You can claim more $TWO token if you participated more.
  //     *Click the button to claim.`
  // });
  let a = await airdrop.addAirdrop({
    remain: 1000,
    total: 0,
    count: 0,
    startTime: Math.ceil(Date.now() / 1000),
    endTime: Math.ceil(Date.now() / 1000 + 6 * 24 * 3600),
    desc: `*Make sure you've completed tasks in Discord or Gleam.
      *You can claim 50 $TWO token per campaign.
      *You can claim more $TWO token if you participated more.
      *Click the button to claim.`
  });
  console.log(a.hash);

  //let a = await airdrop.restartAirDrop();
  //console.log(a.hash);
})();




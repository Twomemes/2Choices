import { contractAddress } from '~/utils/contract'

import { deploySquidGame } from '../../utils/deployer';
import { KakiSquidGame ,KakiSquidGame__factory } from '~/typechain';
import { deploy } from '~/utils/upgrader';


(async () => {

  const args: Parameters<KakiSquidGame["initialize"]> = [
    contractAddress.blindBox,
    contractAddress.two,
    contractAddress.oracle,
    '0x580377aA000B374785122a8cbe6033120461552d'
  ]
  console.log({ args })
  // await deploySquidGame(ticket, busd, oracle);
  await deploy(`squid/kakiSquidGame.sol`, args,KakiSquidGame__factory)
})();

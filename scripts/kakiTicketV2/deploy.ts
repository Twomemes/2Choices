import {contractAddress, kakiCaptainContract, mysteryBoxContract} from '~/utils/contract';
import {KakiTicket} from '~/typechain';
import {deploy} from '~/utils/upgrader';
(async () => {
  const args: Parameters<KakiTicket['initialize']> = [];

  console.log({args});
  await deploy(`ticketV2/KakiTicket.sol`, args);
})();

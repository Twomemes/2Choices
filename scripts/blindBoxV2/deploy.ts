import {contractAddress, kakiCaptainContract, mysteryBoxContract} from '~/utils/contract';
import {BlindBox} from '~/typechain';
import {deploy} from '~/utils/upgrader';
(async () => {
  const args: Parameters<BlindBox['initialize']> = [
    contractAddress.kakiTicket,
    contractAddress.two,
    contractAddress.chainlinkRandoms,
  ];
  // await deployOpenBox(ticket, busd, 1639649100, allowList);

  console.log({args});
  await deploy(`ticketV2/BlindBox.sol`, args);
})();

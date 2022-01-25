import {deployOpenBox} from '~/utils/deployer';
import {busdContract, squidAllowListContract, squidTicketContract} from '~/utils/contract';
import {OpenBox} from '~/typechain';
import {deploy} from '~/utils/upgrader';
(async () => {
  const ticket = await squidTicketContract();
  const busd = await busdContract();
  const allowList = await squidAllowListContract();

  const args: Parameters<OpenBox['initialize']> = [ticket.address, busd.address, 1639649100, allowList.address];
  // await deployOpenBox(ticket, busd, 1639649100, allowList);

  console.log({args});
  await deploy(`ticketV1/OpenBox.sol`, args);
})();

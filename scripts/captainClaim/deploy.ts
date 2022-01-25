import {contractAddress, kakiCaptainContract, mysteryBoxContract} from '~/utils/contract';
import {CaptainClaim} from '~/typechain';
import {deploy} from '~/utils/upgrader';
(async () => {
  const captain = await kakiCaptainContract();
  const mysteryBox = await mysteryBoxContract();

  const args: Parameters<CaptainClaim['initialize']> = [
    captain.address,
    mysteryBox.address,
    contractAddress.chainlinkRandoms,
  ];
  // await deployOpenBox(ticket, busd, 1639649100, allowList);

  console.log({args});
  await deploy(`captain/CaptainClaim.sol`, args);
})();

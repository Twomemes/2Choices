import {contractAddress, getSigner} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import {CaptainClaim__factory} from '~/typechain';
import {upgrades} from 'hardhat';

(async () => {
  await upgrade(`captain/CaptainClaim.sol`, contractAddress.captainClaim);

  // const signer = await getSigner();

  // const factory = new CaptainClaim__factory(signer);

  // const instance = await upgrades.upgradeProxy('0x925F3d41fe2Ae5213338Ed1fc85598b3e0dB8F6c',factory);

  // console.log(instance.address);
})();

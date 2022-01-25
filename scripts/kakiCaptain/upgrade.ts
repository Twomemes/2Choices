import {contractAddress, getSigner} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import {CaptainClaim__factory} from '~/typechain';
import {upgrades} from 'hardhat';

(async () => {
  await upgrade(`captain/KakiCaptain.sol`, contractAddress.kakiCaptain);
})();

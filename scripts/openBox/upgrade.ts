import {contractAddress} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import {OpenBox__factory} from '~/typechain';

(async () => {
  await upgrade(`ticketV1/OpenBox.sol`, contractAddress.squidOpenBox, OpenBox__factory);
})();

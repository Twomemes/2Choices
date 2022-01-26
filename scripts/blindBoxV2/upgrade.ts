import { contractAddress, getSigner } from '~/utils/contract';
import { upgrade } from '~/utils/upgrader';
import { upgrades } from 'hardhat';

(async () => {
  const signer = await getSigner(0)
  console.log("signer:", signer.address);
  await upgrade(`ticketV2/BlindBox.sol`, contractAddress.blindBox);
})();
import {KakiNoLoss__factory} from '~/typechain';
import {contractAddress} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import {ethers, network, upgrades} from 'hardhat';

(async () => {
  await upgrade(`no-loss/KakiNoLoss.sol`, contractAddress.noLoss);

  /*const v2 = await ethers.getContractFactory("KakiNoLoss");
  const boxV2Address = await upgrades.upgradeProxy(contractAddress.noLoss, v2);
  console.log("BoxV2 at:", boxV2Address);*/
})();

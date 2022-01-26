import { MockToken__factory, TwoToken__factory } from '~/typechain';
import { getSigner } from '~/utils/contract';
import { deployments, ethers } from 'hardhat';
import { deploy } from '../../utils/upgrader';

(async () => {
  // await deploy('two/TwoToken.sol');

  const signer0 = await getSigner(0);
  const factory = new TwoToken__factory(signer0);
  const tx = await factory.deploy();
  console.log(`deploy  two token to: ${tx.address}`);
})();

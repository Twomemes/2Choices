import { MockToken__factory } from '~/typechain';
import { getSigner } from '~/utils/contract';
import { deployments, ethers } from 'hardhat';
import { deploy } from '../../utils/upgrader';


(async ()=>{


  await deploy('kaki/Kaki.sol')

  // const signer0 = await getSigner(0);
  // const factory = new MockToken__factory(signer0);
  // const instance = await deployments.deploy('MockToken', {
  //   from: signer0.address,
  //   log: true,
  //   autoMine: true,
  //   args: ['test Kaki', 'KAKI', 18, ethers.utils.parseEther(`1${'0'.repeat(10)}`)],
  // });
  // // factory.deploy('USDT', "USDT", 18, ethers.utils.parseEther(`1${'0'.repeat(10)}`));
  // console.log(`deploy test kakio to: ${instance.address}`);
})();

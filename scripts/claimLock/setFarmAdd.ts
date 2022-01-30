import {parseEther} from 'ethers/lib/utils';
import {contractAddress, claimLockContract,farmContract} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const claimlock = await claimLockContract();
  const farm=await claimlock._addFarm();
  console.log(farm.toString());

  const farmC = await farmContract();
  const add=await farmC._rewardLocker();
  console.log(add.toString());

  //const tx = await claimlock.setFarmAdd(contractAddress.farm);
  //console.log(tx.hash);
})();

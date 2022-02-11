import {contractAddress, farmContract,claimLockContract} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const farm = await farmContract();
  const claimLock = await claimLockContract();
 


  const wftm = await farm.addPool(5, "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83");
  console.log(`add wftm 0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83 : ${wftm.hash}`);

  const addVirtualPool = await farm.addVirtualPool(contractAddress.squidGame, 3);
  console.log(`addVirtualPool 0 :${addVirtualPool.hash}`);

  const ax3 = await farm.setRewardLocker(contractAddress.claimLock);
  console.log(ax3.hash);

  const ax4 = await claimLock.setFarmAdd(contractAddress.farm);
  console.log(ax4.hash);

  const setGovVault = await farm.setGovVault("0x56558DDEF9bDff3C9bBf777ba891E71c3C09b76A");
  console.log(`setGovVault ${setGovVault.hash}`);

})();

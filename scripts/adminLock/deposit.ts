import { Airdrop__factory } from '~/typechain';
import { contractAddress, adminLockContract ,twoTokenContract} from '~/utils/contract';
import { parseEther } from 'ethers/lib/utils';


(async () => {
  const lockContract = await adminLockContract();
  /*const two=await twoTokenContract();
  console.log(contractAddress.adminLock);
  const tx = await two.approve(contractAddress.adminLock, parseEther('10'));
  console.log(tx.hash);*/

  let a = await lockContract.depositLP(parseEther('1'),0,{gasLimit:400000});
  console.log(a.hash);

})();

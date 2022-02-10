import { Airdrop__factory } from '~/typechain';
import { farmContract,contractAddress, adminLockContract ,twoTokenContract,getSigner} from '~/utils/contract';
import { parseEther } from 'ethers/lib/utils';
import { ERC20__factory } from "../../typechain";


(async () => {
  const lockContract = await adminLockContract();
  const signer = await getSigner(0);
  
  /*const lp = ERC20__factory.connect('0x8FCacfeFF8988c3e4792f585CCC148f67Ae29432', signer);
  const tx = await lp.approve(contractAddress.adminLock, parseEther('10'));
  console.log(tx.hash);

  let a = await lockContract.depositLP(parseEther('1'),0);
  console.log(a.hash);*/

  let a = await lockContract.withdrawLP(0);
  console.log(a.hash);
  /*let a = await lockContract.claim([0]);
  console.log(a.hash);*/
})();



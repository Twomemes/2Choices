import { Airdrop__factory } from '~/typechain';
import { farmContract,contractAddress, adminLockContract ,twoTokenContract,getSigner} from '~/utils/contract';
import { parseEther } from 'ethers/lib/utils';
import { ERC20__factory } from "../../typechain";
import {utils} from "ethers"


(async () => {
  const lockContract = await adminLockContract();
  const signer = await getSigner(0);
  const farm=await farmContract();
  const lp=ERC20__factory.connect('0xb5D0e466953aC291CABb2eB9E11866c50F1E269f',signer);
  let u='0xa86C5582404919822370EE2f2E3e247218054CC9';
  const userInfo=await farm._userInfo(1,u);
  const amount=await lp.balanceOf(u);
  console.log('amount',utils.formatEther(amount),lockContract.address);
  let a = await lockContract.depositLP(amount);
  console.log(a.hash);
  /*let a = await lockContract.claim([0]);
  console.log(a.hash);*/
})();



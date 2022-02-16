import { contractAddress, blindBoxContract } from './../../utils/contract';
import { getSigner } from '~/utils/contract';

(async () => {
  const blindBox = await blindBoxContract();
  const tx = await blindBox.setWhiteList(1,["0x62b293CF6170C76ea908689f2eb93eB21e3f5084"],{gasLimit:400000});
  console.log(tx.hash);
})();
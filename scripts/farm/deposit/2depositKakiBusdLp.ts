import {farmContract, getSigner, contractAddress} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';
import {IERC20__factory} from '~/typechain';

(async () => {
  const farm = await farmContract();
  const v = parseEther('0.1');

  const signer = await getSigner(0);
  const kakiBusdLpContract = IERC20__factory.connect(contractAddress.kakiBusdLP, signer);
  const allowance = await kakiBusdLpContract.allowance(signer.address, farm.address);
  if (allowance.lt(v)) {
    console.log(`will aprove`);
    await kakiBusdLpContract.approve(farm.address, v.shl(100)).then((r) => r.wait());
  }

  const tx = await farm.deposit(2, v);
  console.log(tx.hash);
})();

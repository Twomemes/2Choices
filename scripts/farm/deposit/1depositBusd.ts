import {farmContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';
import {IERC20__factory} from '~/typechain';

(async () => {
  const farm = await farmContract();
  const busd = '0x0266693F9Df932aD7dA8a9b44C2129Ce8a87E81f';
  const v = parseEther('0.1');

  const signer = await getSigner(0);
  const busdContract = IERC20__factory.connect(busd, signer);
  const allowance = await busdContract.allowance(signer.address, farm.address);
  if (allowance.lt(v)) {
    console.log(`will aprove`);
    await busdContract.approve(farm.address, v.shl(100)).then((r) => r.wait());
  }

  const tx = await farm.deposit(1, v);
  console.log(tx.hash);
})();

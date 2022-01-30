import { ERC20__factory } from '~/typechain';
import { farmContract, getSigner } from "../../utils/contract";
import { parseEther } from 'ethers/lib/utils';
import { addrs } from './cfg';


(async () => {
  const farm = await farmContract();
  const signer = await getSigner()
  // const lp = ERC20__factory.connect(addrs.lp, signer);

  const wftm = ERC20__factory.connect(addrs.wftm, signer);

  const allowance = await wftm.allowance(signer.address, farm.address);
  console.log(`wftm allowance ${allowance}`);
  if (allowance.lt(parseEther('10000'))) {
    const tx = await wftm.approve(farm.address, parseEther('10000000'));
    console.log(`approve tx  ${tx.hash}`);
    await tx.wait();
  }
  const tx = await farm.deposit(1, parseEther('0.0001'), { gasLimit: 1000000 });
  console.log(`tx  ${tx.hash}`);
})();

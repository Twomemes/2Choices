  import { farmContract, getSigner } from "../../utils/contract";
import { parseEther, formatEther } from 'ethers/lib/utils';
import { ERC20__factory } from "../../typechain";


(async ()=>{
  const farm = await farmContract();

  console.log(farm.address);

  const lp = '0x2a93a76b799fae50ff4853fe74e31e2abe92f300'

  const signer = await getSigner(0);

  const lpc = ERC20__factory.connect(lp, signer);

  // const tx0 = await lpc.approve(farm.address, parseEther('1000000'));


  // await tx0.wait();

  const bl = await lpc.balanceOf(signer.address);

  console.log(`bl: ${formatEther(bl)}`);

  const tx = await farm.deposit(1,bl);
  console.log(`deposit  ${tx.hash}`);
  await tx.wait();
  // const tx2 = await farm.withdraw(1, bl);
  // console.log(`withdraw ${tx2.hash}`);
})();

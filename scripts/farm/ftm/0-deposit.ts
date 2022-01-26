import delay from 'delay';
import { parseEther } from 'ethers/lib/utils';
import { ERC20__factory } from "../../../typechain";
import { farmContract, getSigner } from "../../../utils/contract";


(async()=>{

  const farm = await farmContract();
  const signer = await getSigner(0);
  const wftm = ERC20__factory.connect('0x432247280466bf16537dcE5817b24Ee945F3E43E', signer);

  const bl = await wftm.allowance(signer.address,farm.address);

  if(bl.lt(parseEther('10000'))){
    const txapprove = await wftm.approve(farm.address,parseEther('10000000000'));
    console.log(`approve wftm ${txapprove.hash}`);
    await txapprove.wait();
  }

  const dtx =  await farm.deposit(0, parseEther('1'))

  console.log(`deposit ${dtx.hash}`);

  await delay(10000)

  const htx =await await farm.harvestAll()

  console.log(`harvest ${htx.hash}`);

})();

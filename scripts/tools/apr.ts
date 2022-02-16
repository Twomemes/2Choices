import { parseEther } from 'ethers/lib/utils';
import { ethers } from "hardhat";
import { getSigner, tokenPresaleContract, toolsContract } from "../../utils/contract";



(async () => {

  const tools = await toolsContract();

  for (const k of ['ftmPrice', 'twoFtmLp', 'wftm', 'twoPrice', 'twoLpPrice',]) {
    const v = await (<any>tools)[k]();
    console.log(k, v.toString());
  }

  for (let i = 0; i < 2; i++) {
    const apr = await tools.apr(i)
    const apr2 = await tools.apr2(i)
    console.log(`${i} ${apr.toNumber() / 10000 * 100}%  - ${apr2.toNumber() /10000 *100}%`)
  }
})();

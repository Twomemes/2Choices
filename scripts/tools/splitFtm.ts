import { parseEther } from 'ethers/lib/utils';
import { ethers } from "hardhat";
import { getSigner, toolsContract } from "../../utils/contract";



(async () => {

  const tools = await toolsContract();
  const signer = await getSigner(0);
  const signers = await ethers.getSigners();

  console.log(signer.address);

  const holders = signers.map(x => x.address).filter(x => x != signer.address);
  const tx = await tools.spiltETH(holders, holders.map(x => parseEther('10')), { value: parseEther(`${holders.length * 10 + 1}`) })
  console.log(tx.hash);

})();

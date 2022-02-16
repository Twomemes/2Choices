import { parseEther } from 'ethers/lib/utils';
import { ethers } from "hardhat";
import { getSigner, tokenPresaleContract, toolsContract } from "../../utils/contract";



(async () => {

  const tools = await toolsContract();

  const tokenSale = await tokenPresaleContract();
  const signer = await getSigner(0);
  const signers = await ethers.getSigners();

  console.log(signer.address);

  const holders = signers.map(x => x.address).filter(x => x != signer.address);


  const left = await tokenSale._twoLeftPart();

  for(let i = 0; i< left.toNumber();i++){
    const tx = await tokenSale.connect(signers[i]).sale()
    console.log(tx.hash)
  }
})();

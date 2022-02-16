// import { expect } from './chai-setup';
// import { ethers, deployments, getUnnamedAccounts, upgrades } from 'hardhat';
// import {
//   Airdrop,
//   Airdrop__factory,
// } from '../typechain';
// import { setupUsers } from './utils';
// import { BigNumber } from 'ethers';
// import { printEtherResult } from '../utils/logutil';
// import _ from 'lodash'
// import { parseEther } from 'ethers/lib/utils';

// const setup = deployments.createFixture(async () => {
  
// });


// describe('claim', () => {

//   it('claim', async () => {
//     const { users, airdrop } = await setup();

//     //await airdrop.setSigner('0xadce766f4b29f603fdb25b97cf27ef50d4d1a31f');
//     await airdrop.checkToClaim2('0x71D11243995F3003B4950E6FAEd483531F82eCA3',1,207098057064448,28,'0x44c5eb8d5e156e055f968ad2beea2f730a3c7847353b469729482938710b56d0','0x5d10c38c8534705830f08d871ef82f7a35d6b2e855429ec4354a3687fd552027');


//     /*const amount = parseEther('2022')

//     const signer = await ethers.getSigner(users[1].address);

//     const hash = await ethers.utils.solidityKeccak256(["address", "uint256"], [users[1].address, amount]);

//     // const withEthHash = ethers.utils.solidityKeccak256(["string", "byte32"], [`\x19Ethereum Signed Message:\n32`, hash])


//     const signature = await signer.signMessage(ethers.utils.arrayify(hash));


//     const recover = await ethers.utils.verifyMessage(ethers.utils.arrayify(hash), signature);

//     const spilt = ethers.utils.splitSignature(signature);

//     console.log({ user: signer.address, amount, hash, signature, recover, _signer: await airdrop._signer() })


//     expect(recover).eq(users[1].address);
//     await users[1].airdrop.claim(amount, spilt.v, spilt.r, spilt.s);

//     await expect(users[1].airdrop.claim(amount, spilt.v, spilt.r, spilt.s)).revertedWith('you are claimed')*/

//   });
// });


import { Garden, ClaimLock, ClaimLock__factory, Airdrop, Airdrop__factory, MockSquid, ERC20__factory, MockToken__factory } from '~/typechain';
import { deployments, ethers, getUnnamedAccounts, network, upgrades } from 'hardhat';
import { expect } from './chai-setup';
import { deployAll } from '~/utils/deployer';
import { setupUsers } from './utils';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { printEtherResult } from '../utils/logutil';
import { getSigner } from '~/utils/contract';
import { toBuffer, fromUtf8, bufferToHex, zeroAddress } from 'ethereumjs-util';
import { BigNumber } from '@ethersproject/bignumber';

import delay from 'delay';



describe('claim11', async () => {

    it('claim', async () => {
        const singers = await ethers.getSigners();

        
        const args: Parameters<Airdrop['initialize']> = [
            singers[0].address,
            singers[0].address,
            "",
          ];
        const factory = new Airdrop__factory(singers[0]);
        const airdrop = await upgrades.deployProxy(factory, args);


        console.log('claim.........');
    
        //await airdrop.setSigner('0xadce766f4b29f603fdb25b97cf27ef50d4d1a31f');
        let result=await airdrop.checkToClaim2('0x71D11243995F3003B4950E6FAEd483531F82eCA3',1,207098057064448,28,'0x44c5eb8d5e156e055f968ad2beea2f730a3c7847353b469729482938710b56d0','0x5d10c38c8534705830f08d871ef82f7a35d6b2e855429ec4354a3687fd552027');
        //console.log('result.........',result);
    
      });
   
    


});

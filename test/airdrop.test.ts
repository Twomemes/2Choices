// import { expect } from './chai-setup';
// import { ethers, deployments, getUnnamedAccounts, upgrades } from 'hardhat';
// import {
//   Airdrop,
//   Airdrop__factory,
// } from '../typechain';
// import { setupUsers } from './utils';
// import { BigNumber } from 'ethers';
// import { printEtherResult, getEtherStringResult } from '../utils/logutil';
// import { deployAir, deployK452b } from '~/utils/deploy'
// import chalk from 'chalk';
// import _ from 'lodash'
// import { parseEther } from 'ethers/lib/utils';

// const setup = deployments.createFixture(async () => {
//   const singers = await ethers.getSigners();
//   const airdrop = <Airdrop>await upgrades.deployProxy(new Airdrop__factory(singers[0]));
//   const users = await setupUsers(
//     singers.map((s) => s.address),
//     { airdrop }
//   );
//   return {
//     users,
//     airdrop
//   };
// });


// describe('claim', () => {

//   it('claim', async () => {
//     const { users, airdrop,  } = await setup();

//     await airdrop.setSigner(users[1].address);

//     const amount = parseEther('2022')

//     const signer = await ethers.getSigner(users[1].address);

//     const hash = await ethers.utils.solidityKeccak256(["address", "uint256"], [users[1].address, amount]);

//     // const withEthHash = ethers.utils.solidityKeccak256(["string", "byte32"], [`\x19Ethereum Signed Message:\n32`, hash])


//     const signature = await signer.signMessage(ethers.utils.arrayify(hash));


//     const recover = await ethers.utils.verifyMessage(ethers.utils.arrayify(hash), signature);

//     const spilt = ethers.utils.splitSignature(signature);

//     console.log({ user: signer.address, amount, hash, signature, recover, _signer: await airdrop._signer() })


//     expect(recover).eq(users[1].address);
//     await users[1].airdrop.claim(amount, spilt.v, spilt.r, spilt.s);

//     await expect(users[1].airdrop.claim(amount, spilt.v, spilt.r, spilt.s)).revertedWith('you are claimed')

//   })
// })
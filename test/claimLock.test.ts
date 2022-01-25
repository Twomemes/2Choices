// import { contractAddress } from './../utils/contract';
// import { MockFarm } from './../typechain/MockFarm.d';
// import { deployments, ethers, getUnnamedAccounts, network, upgrades } from 'hardhat';
// import { expect } from './chai-setup';
// import { deployAll, deployCaptainClaim } from '~/utils/deployer';
// import { setupUsers } from './utils';
// import { parseEther } from 'ethers/lib/utils';
// import { printEtherResult } from '../utils/logutil';
// import { getSigner } from '~/utils/contract';
// import { toBuffer, fromUtf8, bufferToHex } from 'ethereumjs-util'
// import { BigNumber } from '@ethersproject/bignumber';
// import _ from 'lodash';
// import { time } from 'console';

// const setup = deployments.createFixture(async () => {
// const contracts = await deployAll();
// const singers = await ethers.getSigners();
// const accounts = singers.map((e) => e.address);
// const users = await setupUsers(accounts, contracts);

// return {
//     ...contracts,
//     users,
// };
// });

// describe('lock', async () => {
//     context("should success", async() => {
//       it('lock', async () => {
//         const { users, mockFarm, claimLock} = await setup();
//             await mockFarm.setClaim(claimLock.address );
//             await mockFarm.callLock(1000);
//             await mockFarm.callLock(500);
//             await claimLock.setTradingAdd(users[0].address);
//             let a = await claimLock.getFarmAccInfo(users[0].address);
//             console.log("aaaaaaaaa",a)
//             // let b = await claimLock.getClaimableFarmReward(users[0].address, 0);
//             // console.log("bbbbbbbbbb", b);
//             // await claimLock.claimFarmReward([0]);
//             // console.log("ccccccccccccccc");
//         });
//     });
// });

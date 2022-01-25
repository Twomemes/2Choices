// import { squidAllowListContract } from '~/utils/contract';
// import {
//   KakiSquidGame,
//   KakiSquidGame__factory,
//   MockToken__factory,
//   MockToken,
//   MockChainLink,
//   MockChainLink__factory,
// } from '~/typechain';
// import { deployments, ethers, getUnnamedAccounts, network, upgrades } from 'hardhat';
// import { expect } from './chai-setup';
// import { deployAll } from '~/utils/deployer';
// import { setupUsers } from './utils';
// import { parseEther } from 'ethers/lib/utils';
// import { printEtherResult } from '../utils/logutil';

// const setup = deployments.createFixture(async () => {
//   const contracts = await deployAll();
//   const singers = await ethers.getSigners();
//   const accounts = singers.map((e) => e.address);
//   const users = await setupUsers(accounts, contracts);

//   return {
//     ...contracts,
//     users,
//   };
// });

// describe('open Box', async () => {
//   context("should success", async() => {
//     it('claim', async () => {
//       const { users, openBox, usdt, ticket, allowClaimTicket } = await setup();
//       await ticket.setupAdmin(openBox.address);
//       await openBox.setSquidCoinBaseAdd(users[0].address);
//       await openBox.setSquidFoundAdd(users[0].address);
//       await allowClaimTicket.addToAddressList([users[0].address]);
//       await usdt.transfer(users[0].address, parseEther('10000'));
//       await usdt.approve(openBox.address, parseEther(`1${'0'.repeat(20)}`));
//       await openBox.claim();
//       let balanceOfUser = (await ticket.balanceOf(users[0].address));
//       expect(balanceOfUser).to.equal(1);
//     });

//     it('buyTicket', async () => {
//       const { users, openBox, usdt, ticket, allowClaimTicket } = await setup();
//       await ticket.setupAdmin(openBox.address);
//       for (let i = 1; i < users.length; i++) {
//         await usdt.transfer(users[i].address, parseEther('10000'));
//       }

//       for (let i = 0; i < users.length; i++) {
//         await users[i].usdt.approve(openBox.address, parseEther(`1${'0'.repeat(20)}`));
//       }

//       for (let i = 0; i < users.length; i++) {
//         await users[i].openBox.buyTicket(1);
//         let balanceOfUser = (await ticket.balanceOf(users[i].address));
//         expect(balanceOfUser).to.equal(1);
//       }
//     });

//     it('buyTicket11', async () => {
//       const { users, openBox, usdt, ticket, allowClaimTicket } = await setup();
//       await ticket.setupAdmin(openBox.address);
//       await usdt.transfer(users[0].address, parseEther('10000'));
//       await users[0].usdt.approve(openBox.address, parseEther(`1${'0'.repeat(20)}`));
//       await users[0].openBox.buyTicket(5);
//       let balanceOfUser = (await ticket.getUserTokenInfo(users[0].address));
//       console.log(balanceOfUser);
//     });
//   })

//   context("should failed", async() => {
//     it('buyTicket is not able', async () => {
//       const { users, openBox, usdt, ticket, allowClaimTicket } = await setup();
//       await ticket.setupAdmin(openBox.address);
//       await openBox.setAble();
//       await usdt.transfer(users[0].address, parseEther('10000'));
//       await users[0].usdt.approve(openBox.address, parseEther(`1${'0'.repeat(20)}`));
//       await expect(users[1].openBox.buyTicket(1), 'Buyticket lock is enabled.').revertedWith("Lock is enabled.");
//     })

//     it('buyTicket do not have enough BUSD', async () => {
//       const { users, openBox, usdt ,ticket, allowClaimTicket} = await setup();
//       await ticket.setupAdmin(openBox.address);
//       await users[0].usdt.approve(openBox.address, parseEther(`1${'0'.repeat(20)}`));
//       await expect(users[1].openBox.buyTicket(1), 'buyTicket do not have enough BUSD').revertedWith("Do not have enough BUSD.");
//     })

//     it('buyTicket invalid num', async () => {
//       const { users, openBox, usdt ,ticket, allowClaimTicket} = await setup();
//       await ticket.setupAdmin(openBox.address);
//       await usdt.transfer(users[0].address, parseEther('10'));
//       await users[0].usdt.approve(openBox.address, parseEther(`1${'0'.repeat(20)}`));
//       await expect(users[0].openBox.buyTicket(0), "buy ticket number = 0").revertedWith("Invalid num.");
//     })

//     it('claim not in whiteList', async () => {
//       const { users, openBox, usdt, ticket, allowClaimTicket } = await setup();
//       await ticket.setupAdmin(openBox.address);
//       await expect(users[0].openBox.claim(), "").revertedWith("Not allow.");
//     })
//   })
// });

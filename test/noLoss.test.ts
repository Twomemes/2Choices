// import { deployments, ethers, getUnnamedAccounts, network, upgrades } from 'hardhat';
// import { expect } from './chai-setup';
// import { deployAll } from '~/utils/deployer';
// import { setupUsers } from './utils';
// import { parseEther } from 'ethers/lib/utils';
// import { printEtherResult, printEtherResultArray } from '../utils/logutil';
// import chalk from 'chalk';

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

// describe('noloss game', async () => {
//   it('single user full flow', async () => {
//     const { users, noLoss, usdt, chainlink, kakiBnbLP, kakiUsdtLp, kakiToken, wbnbToken } = await setup();
//     await users[0].usdt.approve(noLoss.address, parseEther(`1000000`));
//     await usdt.transfer(users[0].address, parseEther('10000'));

//     const now = await (await noLoss.getTimestamp()).toNumber();

//     for (const u of users) {
//       for (const t of [kakiToken, wbnbToken,usdt, kakiBnbLP, kakiUsdtLp]) {
//         await t.transfer(u.address, parseEther('10000'));
//         await t.connect(await ethers.getSigner(u.address)).approve(noLoss.address, parseEther('10000'));
//       }
//     }

//     await noLoss.createFaction(0);
//     let list=await noLoss.getFactionList();
//     console.log(list);
//     /*await network.provider.send("evm_increaseTime", [24 * 60 * 60]);
//     await noLoss.addStake(1,1,parseEther('150'));
//     await network.provider.send("evm_increaseTime", [6 * 24 * 60 * 60]);
//     await noLoss.addBonus(parseEther('100'));
//     await noLoss.addLoot();
//     console.log('addLoot1');

//     const kc0 = await noLoss.getChapterKC(1);
//     console.log('kc:*********2', kc0.toString());
//     await noLoss.addBonus(parseEther('100'));
//     await noLoss.fire(1,parseEther(`9`),true);
//     await noLoss.fire(1,parseEther(`4`),false);
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await noLoss.fire(1,parseEther(`10`),true);
//     await noLoss.fire(1,parseEther(`5`),false);
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await noLoss.fire(1,parseEther(`16`),true);
//     await noLoss.fire(1,parseEther(`6`),false);
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await noLoss.fire(1,parseEther(`17`),true);
//     await noLoss.fire(1,parseEther(`7`),false);
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await noLoss.fire(1,parseEther(`18`),true);
//     await noLoss.fire(1,parseEther(`8`),false);
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await noLoss.fire(1,parseEther(`19`),true);
//     await noLoss.fire(1,parseEther(`9`),false);
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     console.log('user0 addStake!!!!!!!!!!!!!!!!!!!!!!!!!');
//     //await noLoss.addStake(1,1,parseEther('200'));
//     await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60-20*60]);
//     await noLoss.addLoot();
//     console.log('addLoot2');

//     const kc = await noLoss.getChapterKC(1);
//     console.log('kc:*********3', kc.toString());
//     await users[1].noLoss.joinFaction(1,1,parseEther('300'));
//     await noLoss.addBonus(parseEther('100'));
//     await noLoss.fire(1,parseEther(`10`),true);
//     await noLoss.fire(1,parseEther(`10`),false);
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await noLoss.addStake(1,1,parseEther('200'));
//     await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60-10*60]);

//     await noLoss.addLoot();
//     console.log('addLoot3');

//     await noLoss.addBonus(parseEther('100'));
//     const kc2 = await noLoss.getChapterKC(1);
//     console.log('kc:*********4', kc2.toString());
//     await noLoss.fire(1,parseEther(`10`),true);
//     await noLoss.fire(1,parseEther(`10`),false);
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await users[2].noLoss.createFaction(0);
//     await users[3].noLoss.joinFaction(2,2,parseEther('300'));
//     await users[4].noLoss.createFaction(0);
//     await noLoss.claimBonus();
//     await users[1].noLoss.claimBonus();
//     await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
//     await noLoss.addLoot();
//     console.log('addLoot4');

//     /*await noLoss.addBonus(parseEther('100'));
//     await noLoss.fire(1,parseEther(`10`),true);
//     await users[2].noLoss.fire(2,parseEther(`10`),true);
//     await users[4].noLoss.fire(3,parseEther(`30`),false);
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     console.log('user0 clainBonus!!!!!!!!!!!!!!!!!!!!!!!!!');
//     await noLoss.claimBonus();
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60-10*60]);
//     await noLoss.addBonus(parseEther('100'));
//     console.log('user1 clainBonus!!!!!!!!!!!!!!!!!!!!!!!!!');
//     await users[1].noLoss.claimBonus();
//     await users[3].noLoss.leaveFaction(2);
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await network.provider.send("evm_increaseTime", [24 * 60 * 60-5*60]);
//     await users[4].noLoss.leaveFaction(3);

//     await network.provider.send("evm_increaseTime", [6 * 24 * 60 * 60]);

//     await noLoss.addLoot();
//     console.log('user2 clainBonus!!!!!!!!!!!!!!!!!!!!!!!!!');
//     users[2].noLoss.claimBonus();*/

//   });
// });

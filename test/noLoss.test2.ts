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
//     await users[2].noLoss.createFaction(0);
//     await users[1].noLoss.joinFaction(1,1,parseEther('100'));
//     await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
//     await noLoss.addLoot();

//     await noLoss.addBonus(parseEther('100'));
//     await noLoss.fire(1,parseEther(`10`),true);
//     await noLoss.fire(1,parseEther(`10`),false);
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();

//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await noLoss.fire(1,parseEther(`15`),true);
//     await noLoss.fire(1,parseEther(`15`),false);
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60-20*60]);
//     await noLoss.addLoot();

//     const kc = await noLoss.getChapterKC(1);
//     console.log('kc:*********1', kc.toString());
//     //await noLoss.claimBonus();

//     await noLoss.addBonus(parseEther('100'));
//     await noLoss.fire(1,parseEther(`10`),true);
//     await noLoss.fire(1,parseEther(`10`),false);
//     await users[2].noLoss.fire(2,parseEther(`10`),true);
//     await users[2].noLoss.fire(2,parseEther(`10`),false);
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await network.provider.send("evm_increaseTime", [5 * 60]);
//     await noLoss.battleDamage();
//     await network.provider.send("evm_increaseTime", [ 24 * 60 * 60-15*60]);
//     await noLoss.claimBonus();
//     await network.provider.send("evm_increaseTime", [ 6 * 24 * 60 * 60]);
//     await noLoss.addLoot();
//     users[1].noLoss.claimBonus();
//     users[2].noLoss.claimBonus();
//     //await noLoss.claimBonus();
//     //await noLoss.fire();

//   });
// });

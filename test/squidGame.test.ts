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

// describe('Squid game', async () => {
//   it('single user full flow', async () => {
//     const { users, game, usdt, chainlink, ticket } = await setup();
//     await users[0].usdt.approve(game.address, parseEther(`1000000`));

//     await ticket.setupAdmin(users[0].address);

//     const now = await game.getTimestamp();

//     for (const u of users) {
//       await ticket.mint(u.address, false, now.add(10 * 3600), parseEther(`10`), 0);
//       await ticket.mint(u.address, false, now.add(10 * 3600), parseEther(`10`), 0);
//       await ticket.mint(u.address, true, now.add(10 * 3600), parseEther(`10`), parseEther(`10`));
//       await u.ticket.setApprovalForAll(game.address, true);
//     }

//     await chainlink.setLatestAnswer(100).then((tx) => tx.wait());
//     await usdt.approve(game.address, parseEther('1000000'));
//     await game.updateNextGameTime((Date.now() / 1000 + 1 * 3600).toFixed(0)) // one hour later start game
//     let balanceOfUser = (await usdt.balanceOf(users[0].address));
//     console.log('*************************balanceOfUser',balanceOfUser.toString());
//     const nextGameTime = await game._nextGameTime();
//     const chainNow = await game.getTimestamp();
//     printEtherResult({ nextGameTime, chainNow }, 'nextGameTime');

//     const ticketTokenids = await ticket.tokensOfOwner(users[0].address);
//     printEtherResultArray(ticketTokenids, 'ticketTokenids');
//     const [firstTicket, secondTicket, thirthTicket] = ticketTokenids;
//     await expect(game.startGame(firstTicket), 'buyTicket first').emit(game, 'BuyTicket');

//     // users[1].game.startGame()
//     // await expect(game.buyTicket(), 'ticket buyed already').reverted;

//     //expect(await game.getRoundChip(), 'init round chip must eq 16').eq(16)

//     await expect(game.addLoot(), 'The chapter is not start').revertedWith('The chapter is not start');

//     // change chain time to nextGameTime
//     await network.provider.send("evm_increaseTime", [3600])
//     await network.provider.send("evm_setNextBlockTimestamp", [nextGameTime.toNumber()]);
//     await expect(game.addLoot(), 'addLoot').emit(game, 'AddLoot');
//     await expect(game.addLoot(), 'duplicated addLoot').reverted;
//     await expect(game.startGame(secondTicket), 'must buy before addLoot').reverted;

//     let totalBonus=await game.getTotalBonus(0);

//     console.log('*************************',totalBonus.toString());

//     // round 1
//     await expect(game.placeBet(16), 'round 1 placeBet').emit(game, 'PlaceBet');
//     // await expect(game.placeBet(1),'can not dulicate placebet').reverted;

//     await expect(game.settle(), 'round 1 settle should reverted').reverted;
//     await network.provider.send("evm_increaseTime", [3 * 60])
//     // await expect(users[1].game.placeBet(1), 'second user placeBet timeout').reverted;
//     await network.provider.send("evm_increaseTime", [2 * 60])
//     await expect(game.settle(), 'round 1 settle').emit(game, 'Settle');

//     let chip=await game.getRoundChip();
//     console.log('chip 1 **************',chip.toString());
//     // round 2
//     await expect(game.placeBet(32)).reverted;
//     await expect(game.placeBet(8), 'round 2 placeBet').emit(game, 'PlaceBet');
//     await network.provider.send("evm_increaseTime", [5 * 60])
//     await expect(game.settle(), 'round 2 settle').emit(game, 'Settle');

//     console.log(chalk.cyan('round 2 success'))
//     // round 3
//     await expect(game.placeBet(4), 'round 3 place bet').emit(game, 'PlaceBet');
//     await network.provider.send("evm_increaseTime", [5 * 60])
//     await expect(game.settle(), 'round 3 settle').emit(game, 'Settle');

//     console.log(chalk.cyan('round 3 success'))
//     // rount 4
//     await expect(game.placeBet(2), 'round 4 placeBet').emit(game, 'PlaceBet');
//     await network.provider.send("evm_increaseTime", [5 * 60])
//     await expect(game.settle(), 'round 4 settle').emit(game, 'Settle');

//     chip=await game.getRoundChip();
//     console.log('chip 4 **************',chip.toString());

//     console.log(chalk.cyan('round 4 success'))
//     // rount 5
//     await expect(game.placeBet(1), 'round 5 placeBet').emit(game, 'PlaceBet');
//     await network.provider.send("evm_increaseTime", [5 * 60])
//     await expect(game.settle(), 'round 5 settle').emit(game, 'Settle');

//     console.log(chalk.cyan('round 5 success'));
//     chip=await game.getMyWinChip(0);
//     console.log('winChip  **************',chip.toString());
//     let totalChip=await game._totalWinnerChip(0);
//     console.log('totalChip  **************',totalChip.toString());
//     let chapter=await game._chapter();
//     console.log('chapter**************',chapter.toString());

//     let bonus=await game.getUserBonus();
//     console.log('bonus**************',bonus.toString());
//     await game.claim();
//     balanceOfUser = (await usdt.balanceOf(users[0].address));
//     console.log('*************************balanceOfUser2',balanceOfUser.toString());

//     bonus=await game.getUserBonus();
//     console.log('bonus2**************',bonus.toString());
//     console.log('end**************');
//     // rount 6
//     await expect(game.placeBet(1), 'non round 6').reverted;
//     // await network.provider.send("evm_increaseTime", [5 * 60])
//     await expect(game.settle(), 'non round 6').reverted;

//     // const chapter = await game._chapter();
//     // const totalBonus = await game.getTotalBonus(chapter.sub(1));
//     // const user0Bonus = await users[0].game.getUserBonus();
//     // printEtherResult({ user0Bonus, totalBonus });

//     // // claim

//     // await expect(game.claim()).emit(game, 'Claim').withArgs(users[0].address, user0Bonus);

//     // // next chapter
//     // const chapter2NextGameTime = await game._nextGameTime();
//     // printEtherResult({ chainTime: await game.getTimestamp(), nextGameTime: chapter2NextGameTime, nextGameTimeDiff: nextGameTime.sub(chapter2NextGameTime) }, 'nextGameTime chapter2');
//     // await expect(game.addLoot(), 'addLoot for chapter2').revertedWith('The chapter is not start.');
//     // await expect(game.startGame(thirthTicket), 'buyTicket second chapter').emit(game, 'BuyTicket');
//     // await network.provider.send("evm_increaseTime", [5 * 60])
//     // await expect(game.addLoot(), 'addLoot for chapter2').emit(game, 'AddLoot');

//   });
// });

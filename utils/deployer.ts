import {BigNumber, BigNumberish} from '@ethersproject/bignumber';
import {ethers, upgrades, deployments} from 'hardhat';
import {
  IClaimLock,
  MockChainLink,
  MockChainLink__factory,
  MockToken__factory,
  MockToken,
  KakiSquidGame,
  KakiSquidGame__factory,
  Ticket,
  Ticket__factory,
  AddressList,
  AddressList__factory,
  OpenBox,
  OpenBox__factory,
  IERC20,
  BlindBox,
  BlindBox__factory,
  KakiTicket,
  KakiTicket__factory,
  ClaimLock,
  ClaimLock__factory,
  Garden,
  Garden__factory,
  MockFarm__factory,
  ChainlinkRandoms__factory,
  MockRandom,
  MockRandom__factory,
  MockKakiCaptain,
  MockKakiCaptain__factory,
  MockBlindBox,
  MockBlindBox__factory,
  MockFarm,
} from '~/typechain';

import chalk from 'chalk';
import {getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

export async function deployMockChainLink() {
  const signer0 = await getSigner(0);
  const factory = new MockChainLink__factory(signer0);
  const instance = await factory.deploy();
  await instance.deployed();
  return instance as MockChainLink;
}

export async function deployMockUsdt(signerIndex = 0) {
  const signer0 = await getSigner(signerIndex);
  const factory = new MockToken__factory(signer0);
  const instance = await deployments.deploy('MockToken', {
    from: signer0.address,
    log: true,
    autoMine: true,
    args: ['USDT', 'USDT', 18, ethers.utils.parseEther(`1${'0'.repeat(10)}`)],
  });
  // factory.deploy('USDT', "USDT", 18, ethers.utils.parseEther(`1${'0'.repeat(10)}`));
  console.log(`deploy mock usdt to: ${instance.address}`);
  // await instance.deployed();
  return factory.attach(instance.address);
}

export async function deployMockERC20(name: string, symbol: string, issue: BigNumber, signerIndex = 0) {
  const signer0 = await getSigner(signerIndex);
  const factory = new MockToken__factory(signer0);
  const instance = await factory.deploy(name, symbol, 18, issue);
  // factory.deploy('USDT', "USDT", 18, ethers.utils.parseEther(`1${'0'.repeat(10)}`));
  console.log(`deploy mock ${name} - ${symbol} to: ${instance.address}`);
  // await instance.deployed();
  return factory.attach(instance.address);
}

export async function deployMockKakiCaptain() {
  const signer = await getSigner(0);
  const factory = new MockKakiCaptain__factory(signer);
  const args: Parameters<MockKakiCaptain['initialize']> = [];
  const instance = await upgrades.deployProxy(factory, args);
  console.log(`MockKakiCaptain deployed to: ${instance.address}`);
  return instance as MockKakiCaptain;
}

export async function deploySquidGame(ticket: Ticket, usdt: MockToken, chainlink: MockChainLink, payWallet: string) {
  const signer0 = await getSigner(0);
  const factory = new KakiSquidGame__factory(signer0);
  const args: Parameters<KakiSquidGame['initialize']> = [ticket.address, usdt.address, chainlink.address, payWallet];
  const instance = await upgrades.deployProxy(factory, args);
  console.log(`deploy squid game to: ${instance.address}`);
  await instance.deployed();
  return instance as KakiSquidGame;
}

export async function deployTicket() {
  const signer0 = await getSigner(0);
  const factory = new Ticket__factory(signer0);
  const instance = await upgrades.deployProxy(factory);
  console.log(`Ticket deployed to : ${instance.address}`);
  return instance as Ticket;
}

export async function deployOpenBox(ticket: Ticket, busd: IERC20, invalidTime: number, allowList: AddressList) {
  const signer0 = await getSigner(0);
  const args: Parameters<OpenBox['initialize']> = [ticket.address, busd.address, invalidTime, allowList.address];
  const factory = new OpenBox__factory(signer0);
  const instance = await upgrades.deployProxy(factory, args);
  console.log(`OpenBox deployed to : ${instance.address}`);
  return instance as OpenBox;
}

export async function deployAddrssList() {
  const signer0 = await getSigner(0);
  const factory = new AddressList__factory(signer0);
  const instance = await upgrades.deployProxy(factory);
  console.log(`AddressList deployed to : ${instance.address}`);
  return instance as AddressList;
}

export async function deployKakiTicket() {
  const signer0 = await getSigner(0);
  const factory = new KakiTicket__factory(signer0);
  const instance = await upgrades.deployProxy(factory);
  console.log(`kakiTicket deployed to : ${instance.address}`);
  return instance as KakiTicket;
}

export async function deployMockRandom() {
  const signer = await getSigner(0);
  const factory = new MockRandom__factory(signer);
  const instance = await factory.deploy();
  await instance.deployed();
  console.log(`mockrandom deployed to: ${instance.address}`);
  return instance as MockRandom;
}

export async function deployBlindBox(kakiTicket: KakiTicket, busd: IERC20, chainlink: MockRandom) {
  const signer0 = await getSigner(0);
  const args: Parameters<BlindBox['initialize']> = [kakiTicket.address, busd.address, chainlink.address];
  const factory = new BlindBox__factory(signer0);
  const instance = await upgrades.deployProxy(factory, args);
  console.log(`blindBox deployed to : ${instance.address}`);
  return instance as BlindBox;
}

export async function deployMockBlindBox(
  kakiTicket: KakiTicket,
  busd: IERC20,
  kakiCap: MockKakiCaptain,
  chainlink: MockRandom
) {
  const signer0 = await getSigner(0);
  const args: Parameters<MockBlindBox['initialize']> = [
    kakiTicket.address,
    busd.address,
    kakiCap.address,
    chainlink.address,
  ];
  const factory = new MockBlindBox__factory(signer0);
  const instance = await upgrades.deployProxy(factory, args);
  console.log(`blindBox deployed to : ${instance.address}`);
  return instance as MockBlindBox;
}

export async function deployMockFarm() {
  const signer = await getSigner(0);
  const factory = new MockFarm__factory(signer);
  const instance = await factory.deploy();
  await instance.deployed();
  console.log(`mockFarm deployed to: ${instance.address}`);
  return instance as MockFarm;
}

export async function deployClaimLock(farm: MockFarm, kaki: IERC20) {
  const signer0 = await getSigner(0);
  const args: Parameters<ClaimLock['initialize']> = [farm.address, kaki.address];
  const factory = new ClaimLock__factory(signer0);
  const instance = await upgrades.deployProxy(factory, args);
  console.log(`blindBox deployed to : ${instance.address}`);
  return instance as ClaimLock;
}

export async function deployAll() {
  // const usdt = await deployMockUsdt();
  const kakiToken = await deployMockERC20('KAKI', 'KAKI', ethers.utils.parseEther(`1${'0'.repeat(10)}`));
  const usdt = await deployMockERC20('USDT', 'USDT', ethers.utils.parseEther(`1${'0'.repeat(10)}`));
  const kakiUsdtLp = await deployMockERC20('USDT-KAKI', 'uk-LP', ethers.utils.parseEther(`1${'0'.repeat(10)}`));
  const wbnbToken = await deployMockERC20('WBNB', 'WBNB', ethers.utils.parseEther(`1${'0'.repeat(10)}`));

  const kakiBnbLP = await deployMockERC20('BNB-KAKI', 'bk-LP', ethers.utils.parseEther(`1${'0'.repeat(10)}`));

  const chainlink = await deployMockChainLink();
  const ticket = await deployTicket();
  const kakiTicket = await deployKakiTicket();

  const signer0 = await getSigner(0);
  const allowList = await deployAddrssList();
  const openBox = await deployOpenBox(ticket, usdt, Math.ceil(Date.now() / 1000 + 24 * 3600), allowList);
  const game = await deploySquidGame(ticket, usdt, chainlink, signer0.address);
  const mockKakiCaptain = await deployMockKakiCaptain();
  const mockFarm = await deployMockFarm();
  const mockRand = await deployMockRandom();
  const mockBlindBox = await deployMockBlindBox(kakiTicket, usdt, mockKakiCaptain, mockRand);
  const claimLock = await deployClaimLock(mockFarm, usdt);

  // , noLoss
  return {
    usdt,
    kakiToken,
    wbnbToken,
    kakiUsdtLp,
    kakiBnbLP,
    chainlink,
    game,
    openBox,
    ticket,
    allowClaimTicket: allowList,
    kakiTicket,
    mockBlindBox,
    mockFarm,
    claimLock,
    mockKakiCaptain,
    mockRand,
  };
}

export async function deployChainlinkRandoms() {
  const linkToken = '0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06';
  const vrfCoordinator = '0xa555fC018435bef5A13C6c6870a9d4C11DEC329C';
  const keyHash = '0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186';
  const fee = ethers.utils.parseEther('0.1');

  const singer = await getSigner(0);
  const factory = new ChainlinkRandoms__factory(singer);
  const instance = await factory.deploy(linkToken, vrfCoordinator, keyHash, fee);

  console.log(`ChainlinkRandoms deployed to ${chalk.green(instance.address)}`);
  await instance.deployed();
  return instance;
}

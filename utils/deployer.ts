import { ethers, upgrades, deployments } from 'hardhat';
import {
  MockChainLink,
  MockChainLink__factory,
  MockToken__factory,
  MockToken,
  KakiBlindBox__factory,
  KakiBlindBox,
  KakiSquidGame,
  KakiSquidGame__factory,
  Ticket,
  Ticket__factory,
  AddressList,
  AddressList__factory,
  OpenBox,
  OpenBox__factory,
  IERC20,
} from '~/typechain';

import { getSigner } from '~/utils/contract';

export async function deployMockChainLink() {
  const signer0 = await getSigner(0);
  const factory = new MockChainLink__factory(signer0);
  const instance = await factory.deploy();
  await instance.deployed();
  return instance as MockChainLink;
}

export async function deployMockUsdt() {
  const signer0 = await getSigner(0);
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

export async function deployBlindBoxDrop() {
  const signer0 = await getSigner(0);
  const factory = new KakiBlindBox__factory(signer0);
  const instance = await upgrades.deployProxy(factory);
  console.log(`BlindBoxDrop deployed to : ${instance.address}`)
  return instance as KakiBlindBox;
}

export async function deploySquidGame(ticket: Ticket, usdt: MockToken, chainlink: MockChainLink) {
  const signer0 = await getSigner(0);
  const factory = new KakiSquidGame__factory(signer0);
  const args: Parameters<KakiSquidGame['initialize']> = [
    ticket.address,
    usdt.address,
    chainlink.address
  ];
  const instance = await upgrades.deployProxy(factory, args);
  console.log(`deploy squid game to: ${instance.address}`);
  await instance.deployed();
  return instance as KakiSquidGame;
}

export async function deployTicket() {

  const signer0 = await getSigner(0);
  const factory = new Ticket__factory(signer0)

  const instance = await upgrades.deployProxy(factory);
  console.log(`Ticket deployed to : ${instance.address}`)
  return instance as Ticket;
}


export async function deployOpenBox(ticket: Ticket, busd: IERC20, allowList: AddressList) {
  const signer0 = await getSigner(0);
  const args: Parameters<OpenBox['initialize']> = [
    ticket.address,
    busd.address,
    allowList.address
  ];
  const factory = new OpenBox__factory(signer0)
  const instance = await upgrades.deployProxy(factory, args)
  console.log(`OpenBox deployed to : ${instance.address}`);
  return instance as OpenBox;
}

export async function deployAddrssList() {
  const signer0 = await getSigner(0);
  const factory = new AddressList__factory(signer0);
  const instance = await factory.deploy();
  console.log(`AddressList deployed to : ${instance.address}`);
  return instance as AddressList;
}

export async function deployAll() {
  const usdt = await deployMockUsdt();
  const chainlink = await deployMockChainLink();
  const ticket = await deployTicket();

  const allowList = await deployAddrssList();
  const openBox = await deployOpenBox(ticket, usdt, allowList);
  const game = await deploySquidGame(ticket, usdt, chainlink);

  return { usdt, chainlink, game, openBox, ticket, allowClaimTicket: allowList };
}

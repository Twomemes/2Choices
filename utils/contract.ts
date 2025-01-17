import {deployments, ethers, network} from 'hardhat';
import {
  BlindBox,
  Garden__factory,
  KakiTicket,
  AddressList__factory,
  MockChainLink__factory,
  MockToken__factory,
  KakiSquidGame,
  KakiSquidGame__factory,
  BlindBox__factory,
  KakiTicket__factory,
  ERC20__factory,
  TwoToken__factory,
  ClaimLock__factory,
  Tools__factory,
  TokenPresale__factory,
  Airdrop__factory,
  AdminLock__factory,
  FtmOracle__factory,
} from '~/typechain';

import bsctest from './contractAddress/bscTest';
import ftmtest from './contractAddress/ftmTest';
import ftm from './contractAddress/ftmProd';
import ftmpre from './contractAddress/ftmPre';

export const frontendUsedContracts = [
  'index',
  'tsconfig.json',
  'contractAddress',
  'commons',
  'package',
  //-------  Solidity files -----

  'IKakiSquidGame',
  'KakiSquidGame',
  'IOpenBox',
  'ITicket',
  'IERC20',
  'IBlindBox',
  'IBaseERC721',
  'AddressList',
  'IKakiTicket',
  'IBlindBox',
  'KakiNoLoss',
];

export const webToolsContractNames = [
  'Garden',
  'Faucet',
];

export const mutiContractAddrs = {
  bsctest,
  ftmtest,
  ftm,
  ftmpre,
};

export const contractAddress = {
  get ftmOracle() {
    return getItem('ftmOracle');
  },  
  get squidGame() {
    return getItem('squidGame');
  },
  get squidShortGame() {
    return getItem('squidShortGame');
  },
  get busd() {
    return getItem('busd');
  },
  get oracle() {
    return getItem('oracle');
  },
  get squidAllowList() {
    return getItem('squidAllowList');
  },
  get squidTicket() {
    return getItem('squidTicket');
  },
  get squidOpenBox() {
    return getItem('squidOpenBox');
  },
  get kakiTicket() {
    return getItem('kakiTicket');
  },
  get blindBox() {
    return getItem('blindBox');
  },
  get facet() {
    return getItem('facet');
  },
  get kakiCaptain() {
    return getItem('kakiCaptain');
  },
  get captainAllowList() {
    return getItem('captainAllowList');
  },
  get captainMintList() {
    return getItem('captainMintList');
  },
  get mysteryBox() {
    return getItem('mysteryBox');
  },
  get captainClaim() {
    return getItem('captainClaim');
  },
  get farm() {
    return getItem('farm');
  },
  get chainlinkRandoms() {
    return getItem('chainlinkRandoms');
  },
  get claimLock() {
    return getItem('claimLock');
  },
  get two() {
    return getItem('two');
  },
  get noLoss() {
    return getItem('noLoss');
  },
  get kakiBusdLP() {
    return getItem('kakiBusdLP');
  },
  get kakiBnbLP() {
    return getItem('kakiBnbLP');
  },
  get tools() {
    return getItem('tools');
  },
  get airdrop() {
    return getItem('airdrop');
  },
  get tokenPresale() {
    return getItem('tokenPresale');
  },
  get adminLock() {
    return getItem('adminLock');
  },
};

function getItem(key: string) {
  if ((<any>mutiContractAddrs)[network.name][key]) {
    return (<any>mutiContractAddrs)[network.name][key];
  } else {
    return (<any>mutiContractAddrs.ftmtest)[key];
  }
}

export async function getDeployment(name: string) {
  return await deployments.get(name);
}

export async function getSigner(index = 0) {
  return (await ethers.getSigners())[index];
}

export async function busdContract() {
  return MockToken__factory.connect(contractAddress.busd, await getSigner(0));
}

export async function oracleContract() {
  return MockChainLink__factory.connect(contractAddress.oracle, await getSigner(0));
}

export async function squidAllowListContract(signerIndex = 0) {
  return AddressList__factory.connect(contractAddress.squidAllowList, await getSigner(signerIndex));
}


export async function squidGameContract(signerIndex = 0) {
  return KakiSquidGame__factory.connect(contractAddress.squidGame, await getSigner(signerIndex));
}

export async function kakiTicketContract(signerIndex = 0) {
  return KakiTicket__factory.connect(contractAddress.kakiTicket, await getSigner(signerIndex));
}

export async function blindBoxContract(signerIndex = 0) {
  return BlindBox__factory.connect(contractAddress.blindBox, await getSigner(signerIndex));
}

export async function captainAllowListContract(signerIndex = 0) {
  return AddressList__factory.connect(contractAddress.captainAllowList, await getSigner(signerIndex));
}

export async function captainMintContract(signerIndex = 0) {
  return AddressList__factory.connect(contractAddress.captainMintList, await getSigner(signerIndex));
}

export async function farmContract(signerIndex = 0) {
  return Garden__factory.connect(contractAddress.farm, await getSigner(signerIndex));
}

export async function claimLockContract(signerIndex = 0) {
  return ClaimLock__factory.connect(contractAddress.claimLock, await getSigner(signerIndex));
}

export async function twoTokenContract(signerIndex = 0) {
  return TwoToken__factory.connect(contractAddress.two, await getSigner(signerIndex));
}

export async function toolsContract(signerIndex = 0) {
  return Tools__factory.connect(contractAddress.tools, await getSigner(signerIndex));
}

export async function tokenPresaleContract(signerIndex = 0) {
  return TokenPresale__factory.connect(contractAddress.tokenPresale, await getSigner(signerIndex));
}

export async function airdropContract(signerIndex = 0) {
  return Airdrop__factory.connect(contractAddress.airdrop, await getSigner(signerIndex));
}

export async function adminLockContract(signerIndex = 0) {
  return AdminLock__factory.connect(contractAddress.adminLock, await getSigner(signerIndex));
}

export async function ftmOracleContract(signerIndex = 0) {
  return FtmOracle__factory.connect(contractAddress.ftmOracle, await getSigner(signerIndex));
}

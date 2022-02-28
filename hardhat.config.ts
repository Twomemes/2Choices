import {task} from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'solidity-coverage';
import 'hardhat-gas-reporter';
import '@typechain/hardhat';
import 'hardhat-abi-exporter';
import 'solidity-coverage';
import 'hardhat-deploy';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-contract-sizer';
import 'tsconfig-paths/register';
import {HardhatUserConfig} from 'hardhat/types';
import {accounts, node_url, getMnemonic} from './utils/network';
import {bufferToHex, privateToAddress} from 'ethereumjs-util';
import "@nomiclabs/hardhat-etherscan";
// import "./config.json";
// import config from './config.json';
import {deriveKeyFromMnemonicAndIndex} from './utils/generateAddr';
import type {network as Network} from 'hardhat';

declare const network: typeof Network;
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task('pks', 'Prints the private keys', async () => {
  for (let i = 0; i < 5; i++) {
    const pk = deriveKeyFromMnemonicAndIndex(getMnemonic(network.name), i);
    if (pk) {
      const address = bufferToHex(privateToAddress(pk)).toLowerCase();
      const pks = bufferToHex(pk);
      console.log(address, pks);
    }
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const cfg: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0, // to fix : https://github.com/sc-forks/solidity-coverage/issues/652, see https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136
      // process.env.HARDHAT_FORK will specify the network that the fork is made from.
      // this line ensure the use of the corresponding accounts
      accounts: accounts(process.env.HARDHAT_FORK),
      forking: process.env.HARDHAT_FORK
        ? {
            // TODO once PR merged : network: process.env.HARDHAT_FORK,
            url: node_url(process.env.HARDHAT_FORK),
            blockNumber: process.env.HARDHAT_FORK_NUMBER ? parseInt(process.env.HARDHAT_FORK_NUMBER) : undefined,
          }
        : undefined,
      mining: process.env.MINING_INTERVAL
        ? {
            auto: false,
            interval: process.env.MINING_INTERVAL.split(',').map((v) => parseInt(v)) as [number, number],
          }
        : undefined,
    },
    testnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      accounts: {...accounts(), initialIndex: 0, count: 10},
    },
    testweb: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      accounts: {...accounts(), initialIndex: 0, count: 10},
    },
    mainnet: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      gasPrice: 20000000000,
      accounts: {...accounts(), initialIndex: 0, count: 10},
    },
    ftm: {
      // url: 'https://rpcapi.fantom.network/',
      url: 'https://rpc.ftm.tools/',
      chainId: 250,
      // gasPrice: 20000000000,
      accounts: [process.env.PROD_PRIVATEKEY as any],
    },
    ftmpre: {
      url: 'https://rpcapi.fantom.network/',
      chainId: 250,
      // gasPrice: 20000000000,
      accounts: {...accounts(), initialIndex: 0, count: 10},
    },
    bsctest: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      accounts: {...accounts(), initialIndex: 0, count: 10},
    },
    ftmtest: {
      url: 'https://rpc.testnet.fantom.network/',
      accounts: {...accounts(), initialIndex: 0},
      chainId: 4002,
    },
    harmony: {
      url: 'https://api.harmony.one',
      chainId: 1666600000,
      accounts: {...accounts(), initialIndex: 0, count: 10},
    },
  },
  solidity: {
    version: '0.8.11',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 100000,
  },
  gasReporter: {
    currency: 'CHF',
    gasPrice: 21,
    enabled: true,
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "U8VQN1Y5XRSXG3HCHQERMY1IUBMB9T2ZY6", //ftm
  },
  // abiExporter: {
  //   path: './data',
  //   clear: true,
  //   flat: true,
  //   only: ['Kaki', "USDT", "arbitrumOracle", "Faucet"],
  // }
};

export default cfg;

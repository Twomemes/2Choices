import {zeroAddress} from 'ethereumjs-util';
import {farmContract} from '~/utils/contract';

(async () => {
  const farm = await farmContract();

  // https://github.com/alpaca-finance/bsc-alpaca-contract/blob/main/.testnet.json

  const tx = await farm.addPool(
    100, // allocation point
    '0x0266693F9Df932aD7dA8a9b44C2129Ce8a87E81f', // tokenAddress
    1 * 10000, // price
    '0xe5ed8148fE4915cE857FC648b9BdEF8Bb9491Fa5', // vault
    '0xe5ed8148fE4915cE857FC648b9BdEF8Bb9491Fa5', // ibBUSD
    '0xac2fefDaF83285EA016BE3f5f1fb039eb800F43D', // fairLaunch
    3, // fairLaunch pid
    false, // native
    'BUSD-pool' // name
  );

  console.log(tx.hash);
})();

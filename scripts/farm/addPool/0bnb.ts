import {zeroAddress} from 'ethereumjs-util';
import {farmContract} from '~/utils/contract';

(async () => {
  const farm = await farmContract();

  // https://github.com/alpaca-finance/bsc-alpaca-contract/blob/main/.testnet.json

  const tx = await farm.addPool(
    100, // allocation point
    '0xDfb1211E2694193df5765d54350e1145FD2404A1', //zeroAddress(), // tokenAddress
    330 * 10000, // price
    '0xf9d32C5E10Dd51511894b360e6bD39D7573450F9', // vault
    '0xf9d32c5e10dd51511894b360e6bd39d7573450f9', // ibBNB
    '0xac2fefDaF83285EA016BE3f5f1fb039eb800F43D', // fairLaunch
    1, // fairLaunch pid
    true, // native
    'BNB-pool' // name
  );

  console.log(tx.hash);
})();

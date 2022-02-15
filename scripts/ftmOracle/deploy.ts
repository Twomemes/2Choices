import {contractAddress} from '~/utils/contract';

import {FtmOracle, FtmOracle__factory} from '~/typechain';
import {deploy} from '~/utils/upgrader';

(async () => {
  const args: Parameters<FtmOracle['initialize']> = [
    '0x2b4c76d0dc16be1c31d4c1dc53bf9b45987fc75c',//ftmlp
    '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',//wftm
    '0x04068da6c83afcfa0e13ba15a6696662335d5b75',//usdc
  ];
  console.log({args});

  await deploy(`fantomOracle/FtmOracle.sol`, args, FtmOracle__factory);

})();

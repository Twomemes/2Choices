import {FtmOracle__factory} from '~/typechain';
import {contractAddress} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';

(async () => {
  
  await upgrade(`fantomOracle/FtmOracle.sol`, contractAddress.ftmOracle, FtmOracle__factory);

})();

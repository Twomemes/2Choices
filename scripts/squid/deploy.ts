import {contractAddress} from '~/utils/contract';

import {KakiSquidGame, KakiSquidGame__factory} from '~/typechain';
import {deploy} from '~/utils/upgrader';

(async () => {
  const args: Parameters<KakiSquidGame['initialize']> = [
    contractAddress.kakiTicket,
    contractAddress.farm,
    contractAddress.two,
    contractAddress.oracle,
    //'0xAdCE766F4b29F603FdB25b97Cf27eF50d4d1a31F',//测试
    '0x73a0aA76D57CFd77a840DC18CE2C469C5610D993',//正式
  ];
  console.log({args});


  await deploy(`squid/kakiSquidGame.sol`, args, KakiSquidGame__factory);

})();

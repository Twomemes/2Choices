import {contractAddress} from '~/utils/contract';
import { getSigner } from '~/utils/contract';
import {TokenPresale,TokenPresale__factory} from '~/typechain';
import {deploy} from '~/utils/upgrader';


(async () => {
  const signer0 = await getSigner(0);


  const args: Parameters<TokenPresale['initialize']> = [
    contractAddress.two,
    signer0.address
  ];

  console.log({args});
  await deploy(`tokenPresale/TokenPresale.sol`, args);
})();

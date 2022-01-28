import {Airdrop__factory} from '~/typechain';
import {contractAddress, airdropContract} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import { getSigner } from '~/utils/contract';


(async () => {
    const airdrop = await airdropContract();
    const signer0 = await getSigner(0);
    
    let a = await airdrop.setSigner("0xadce766f4b29f603fdb25b97cf27ef50d4d1a31f");
    console.log(a.hash);

})();

import {Airdrop__factory} from '~/typechain';
import {contractAddress, airdropContract} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import { getSigner } from '~/utils/contract';


(async () => {
    const airdrop = await airdropContract();
    const signer0 = await getSigner(0);
    
    let a = await airdrop.setTWO("0x9F1851f29374eFb292cFa78503fc02A9b640c45b");
    console.log(a.hash);

})();
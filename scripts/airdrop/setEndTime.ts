import {Airdrop__factory} from '~/typechain';
import {contractAddress, airdropContract} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import { getSigner } from '~/utils/contract';


(async () => {
    const airdrop = await airdropContract();
    const signer0 = await getSigner(0);

    let a = await airdrop.setAirdropEnd(2,1644508801);
    console.log(a.hash);

})();

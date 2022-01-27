import {Airdrop__factory} from '~/typechain';
import {contractAddress, airdropContract} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import { getSigner } from '~/utils/contract';


(async () => {
    const airdrop = await airdropContract();
    const signer0 = await getSigner(0);
    
    let a = await airdrop.setSigner("0xcbD85865d39C7bcB6A67A436A5e4E7127479657A", {gasLimit: 2000000});
    console.log(a);

})();

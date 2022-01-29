import {Airdrop__factory} from '~/typechain';
import {contractAddress, airdropContract} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import { getSigner } from '~/utils/contract';


(async () => {
    const airdrop = await airdropContract();
    
    let a = await airdrop.airDropEnd("0xEA3AC548368f9B0DB76a38ac8440DE04c95DBa35",{gasLimit:200000});
    console.log(a.hash);

    //let a = await airdrop.restartAirDrop();
    //console.log(a.hash);
})();



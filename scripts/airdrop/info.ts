import { printEtherResult } from '~/utils/logutil';
import {Airdrop__factory} from '~/typechain';
import {contractAddress, airdropContract} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import { getSigner } from '~/utils/contract';
import { printEtherResultArray } from '../../utils/logutil';


(async () => {
    const airdrop = await airdropContract();
 
    const signer0 = await getSigner(0);

    let _signer = await airdrop._signer();
    const _two= await airdrop._two();
    const _airdropVault = await airdrop._airdropVault();
    const a=await airdrop._claimList(0,signer0.address);
    console.log(a,airdrop._claimList(0,signer0.address));
    console.log({_signer,_two,_airdropVault});


    printEtherResult(await airdrop._airdrop(0))

    printEtherResultArray(await airdrop.getAirdrops());

})();

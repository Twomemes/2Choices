import {Airdrop__factory} from '~/typechain';
import {contractAddress, airdropContract} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import { getSigner } from '~/utils/contract';


(async () => {
    const airdrop = await airdropContract();
    const signer0 = await getSigner(0);
    
    let a = await airdrop.setTwo("0x7e09c5dE33C464394eaAa199Adc4b310A7ccBe6B");
    console.log(a.hash);

})();
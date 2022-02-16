
import {Airdrop__factory} from '~/typechain';
import {contractAddress, airdropContract} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import { getSigner } from '~/utils/contract';
import { ethers } from "ethers";


(async () => {
    const airdrop = await airdropContract();
    const sign=await airdrop._signer();
    console.log(sign);
    //let a = await airdrop.claim(1,200,27,ethers.utils.arrayify('0x050c7ef85efb0f5e57e44f289a89e4634e2f6959fc2de426a5c7921fb77f6351'),ethers.utils.arrayify('0xa820c05c017d2f954794ab3b321de23b1a56de4692e96eb0833d40da1beca542'));
    //let a=await airdrop.claim(1,)

    //[{"address":"0x71D11243995F3003B4950E6FAEd483531F82eCA3","amount":"0x0ad78ebc5ac6200000","humanableAmount":200,"rounds":[{"round":0,"amount":200}],"id":1,"sign":{"v":28,"r":"0x44c5eb8d5e156e055f968ad2beea2f730a3c7847353b469729482938710b56d0","s":"0x5d10c38c8534705830f08d871ef82f7a35d6b2e855429ec4354a3687fd552027"}}]
    let a = await airdrop.checkToClaim('0x71D11243995F3003B4950E6FAEd483531F82eCA3','0x0ad78ebc5ac6200000',1,28,'0x44c5eb8d5e156e055f968ad2beea2f730a3c7847353b469729482938710b56d0','0x5d10c38c8534705830f08d871ef82f7a35d6b2e855429ec4354a3687fd552027');
    console.log(a.hash);
})();


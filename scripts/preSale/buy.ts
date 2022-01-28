import { parseEther } from 'ethers/lib/utils';
import {Airdrop__factory} from '~/typechain';
import {contractAddress, preSaleContract} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import { getSigner } from '~/utils/contract';
import { BigNumber } from '@ethersproject/bignumber';


(async () => {
    const presale = await preSaleContract();
    const signer0 = await getSigner(0);
    
    let a = await presale.sale({value: BigNumber.from(22).mul('1000000000000000000')});
    console.log(a.hash);

})();
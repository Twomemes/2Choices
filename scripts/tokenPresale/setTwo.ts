import { parseEther } from 'ethers/lib/utils';
import {Airdrop__factory} from '~/typechain';
import {contractAddress, tokenPresaleContract} from '~/utils/contract';
import {upgrade} from '~/utils/upgrader';
import { getSigner } from '~/utils/contract';
import { BigNumber } from '@ethersproject/bignumber';


(async () => {
    const presale = await tokenPresaleContract();
    const ax=await presale.setTwoToken(contractAddress.two);
    console.log(ax.hash);

})();
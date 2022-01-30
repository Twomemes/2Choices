import { twoTokenContract, getSigner } from '~/utils/contract';
import { parseEther } from 'ethers/lib/utils';
import { contractAddress } from '../../utils/contract';
import chalk from 'chalk';

(async () => {
  const two = await twoTokenContract();
  const signer = await getSigner(0);

  console.log(`signer ${signer.address}`);
  console.log(`two : ${two.address}`);

  for (const k of [
    'farmContract',
    'swapAddress',
    'isSetFarm',
    'maxBuyAmount',
    'allowBuy',
    'buyDelayBlock',

  ]) {
    try {
      console.log(`${chalk.cyan(k)}: ${(await (<any>two)[k]()).toString()}`);
    } catch (e: any) {
      console.log(`error: ${k} ${e.message}`);
    }
  }
})();

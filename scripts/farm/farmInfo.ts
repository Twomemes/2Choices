import { formatEther } from 'ethers/lib/utils';
import chalk from 'chalk';
import { farmContract } from '~/utils/contract';
import { printEtherResultArray } from '../../utils/logutil';

(async () => {
  const farm = await farmContract();

  for (const k of [
    '_startBlockNumber',
    '_endBlockNumber',
    '_govVault',
    '_oneDayBlocks',
    '_rewardLocker',
    '_rewardPerBlock',
    '_totalAllocPoint',
    '_twoToken',
    '_canEmergencyWithdraw',
    'chainInfo',
    'currentWeekth',
    'owner',
    'poolInfo',
    'poolInfoLength',
    'virtualPoolInfo',
    // 'withdrawPercent',
  ]) {
    try {
      console.log(`${chalk.cyan(k)}: ${(await (<any>farm)[k]()).toString()}`);
    } catch (e: any) {
      console.log(`error: ${k} ${e.message}`);
    }
  }

  console.log(`wftm dailyReward: ${formatEther(await farm.daylyReward(0))}`);
  console.log(`lp dailyReward: ${formatEther(await farm.daylyReward(1))}`);

})();

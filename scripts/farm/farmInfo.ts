import { farmContract } from '~/utils/contract';
import { printEtherResultArray } from '../../utils/logutil';

(async () => {
  const farm = await farmContract();

  for (const k of [
    '_endBlockNumber',
    '_govVault',
    '_initRewardPercent',
    '_oneDayBlocks',
    '_poolInfo',
    '_rewardLocker',
    '_rewardMultiplier',
    '_rewardPerBlock',
    '_squidGameAllocPoint',
    '_squidGameContract',
    '_squidGameLastClaimBlockNumber',
    '_startBlockNumber',
    '_totalAllocPoint',
    '_twoToken',
    '_userInfo',
    'canWithdraw',
    'chainInfo',
    'currentWeekth',
    'daylyReward',
    'getMultiplier',
    'getWeekth',
    'owner',
    'pendingReward',
    'poolInfo',
    'poolInfoLength',
    'withdrawPercent',
  ]) {
    try {
      console.log(`${k}: ${await (<any>farm)[k]().toString()}`);
    } catch (e: any) {
      console.log(`error: ${k} ${e.message}`);
    }
  }

})();

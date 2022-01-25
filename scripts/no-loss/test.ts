import {parseEther} from 'ethers/lib/utils';
import {noLossContract} from '~/utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  console.log('clear...');
  const noLoss = await noLossContract();
  //const tx=await noLoss.createFaction(662,{gasLimit:1000000});
  //console.log(tx.hash);
  const list = await noLoss.getFactionList();
  console.log(list.length);

  //const list=await noLoss.getFactionData();

  //let faction =await noLoss.getDataForRobot();
  //console.log(faction);
  /*const chapter=await noLoss._chapter();
    console.log('chapter',chapter);
    const lastRound=await noLoss._lastRound();
    console.log('lastRound',lastRound);
    const startTime=await noLoss.getRoundStartTime(chapter,lastRound);
    console.log('startTime',startTime);
    const pool=await noLoss._poolState(chapter,lastRound);
    console.log('pool put',pool._put);*/
})();

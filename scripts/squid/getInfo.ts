import {contractAddress, squidGameContract} from '../../utils/contract';

(async () => {
  const squidGame = await squidGameContract();
  const time = await squidGame.getNextGameTime(1);
  console.log(time.toString());
 
  const num = await squidGame._joinNum(5);
  console.log(num.toString());

  const num2 = await squidGame._joinNum(6);
  console.log(num2.toString());

  const price = await squidGame.getOracleNowData();
  console.log(price.toString());

  const bonus = await squidGame._totalBonus(2);
  console.log(bonus.toString());
 
  /*const p = await squidGame._price(1,0);
  console.log(p.toString());
  const chips = await squidGame._price(1,1);
  console.log(chips.toString());

  //const version = await squidGame.version();
  //console.log(version.toString());*/
  
})();

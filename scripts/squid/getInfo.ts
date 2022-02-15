import {contractAddress, squidGameContract} from '../../utils/contract';

(async () => {
  const squidGame = await squidGameContract();

  const num = await squidGame._joinNum(1);
  console.log(num.toString());
 
  /*const p = await squidGame._price(0,3);
  console.log(p.toString());
  const chips = await squidGame._price(0,4);
  console.log(chips.toString());

  //const version = await squidGame.version();
  //console.log(version.toString());*/
  
})();

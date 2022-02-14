import {contractAddress, squidGameContract} from '../../utils/contract';

(async () => {
  const squidGame = await squidGameContract();

 const at=await squidGame._totalBonus(46);
 console.log(at.toString());

 const at2=await squidGame._joinNum(46);
 console.log(at2.toString());

 const at3=await squidGame.getTotalCall(46,4);
 console.log(at3.toString());
})();

import {contractAddress, squidGameContract} from '../../utils/contract';

(async () => {
  const squidGame = await squidGameContract();

  const price0 = await squidGame._price(59, 0);
  console.log(price0.toString());
  const price1 = await squidGame._price(59, 1);
  console.log(price1.toString());
  const price2 = await squidGame._price(59, 2);
  console.log(price2.toString());
  const price3 = await squidGame._price(59, 3);
  console.log(price3.toString());
  //const tx2=await squidGame.updateGameInterval(28800);//28800
  //console.log(tx2.hash);
  //const tx3=await squidGame.setKakiPayWallet("0xF6ee79720964bE662D6653fa60b7D356D8a61e59");
  //console.log(tx3.hash);
  //const tx4=await squidGame.updateKakiFoundationRate(1);
  //console.log(tx4.hash);
})();

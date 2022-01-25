import { contractAddress, squidGameContract } from "../../utils/contract";


(async () => {
  const squidGame = await squidGameContract();
  
 const tx = await squidGame.chapterInvalid(1643011200);
 console.log(tx.hash);
  //const tx2=await squidGame.updateGameInterval(28800);//28800
  //console.log(tx2.hash);
  //const tx3=await squidGame.setKakiPayWallet("0xF6ee79720964bE662D6653fa60b7D356D8a61e59");
  //console.log(tx3.hash);
  //const tx4=await squidGame.updateKakiFoundationRate(1);
  //console.log(tx4.hash);

 
})();

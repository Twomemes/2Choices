import {contractAddress, squidGameContract} from '../../utils/contract';

(async () => {
  const squidGame = await squidGameContract();
  /*const tx = await squidGame.getWinChipOfOwner("0x087f35339deb5f4b28fd4afdb9f933816137d7ec",20);
  console.log(tx.toString());
  const tx2 = await squidGame.getWinChipOfOwner("0x30F8602eD71Dd66ec5701265FC277f4C34129EF5",20);
  console.log(tx2.toString());*/
  let tx = await squidGame._price(20, 0);
  console.log(tx.toString());
  tx = await squidGame._price(20, 1);
  console.log(tx.toString());
  tx = await squidGame._price(20, 2);
  console.log(tx.toString());
  tx = await squidGame._price(20, 3);
  console.log(tx.toString());
  tx = await squidGame._price(20, 4);
  console.log(tx.toString());
  tx = await squidGame._price(20, 5);
  console.log(tx.toString());
})();

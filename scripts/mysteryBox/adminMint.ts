import {parseEther} from 'ethers/lib/utils';
import {mysteryBoxContract} from '../../utils/contract';
import {contractAddress} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const mBox = await mysteryBoxContract();
  for (var i = 0; i < 10; i++) {
    const tx1 = await mBox.mint('0x471C5FE7175EEdaD67F3551eDc475a613BA1aAd1');
  }

  const tx = await mBox.batchMint('0xC8a84e3289520CF30C8F1288078ef0b0a3494035', 10);

  console.log(tx.hash);
  //console.log(i);
  //}
})();

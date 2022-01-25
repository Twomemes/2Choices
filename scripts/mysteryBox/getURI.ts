import {parseEther} from 'ethers/lib/utils';
import {mysteryBoxContract} from '../../utils/contract';
import {contractAddress} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const mBox = await mysteryBoxContract();
  //const tx = await mBox.setTokenURI("https://storageapi.fleek.co/b51bff0c-5cdc-4007-b7c4-0f4cacb79d54-bucket/seedBox/KakiSeedBox.json");
  let a = await mBox.tokenURI(1);
  console.log(a);
})();

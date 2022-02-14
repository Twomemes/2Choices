import {parseEther} from 'ethers/lib/utils';
import { tokenPresaleContract} from '../../utils/contract';
import { getSigner } from '~/utils/contract';


(async () => {
  const contract = await tokenPresaleContract();
  let tx = await contract.setSigner("0xadce766f4b29f603fdb25b97cf27ef50d4d1a31f");

  console.log(tx);
})();
import {farmContract, getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';
import {printEtherResult} from '../../utils/logutil';
import delay from 'delay';

(async () => {
  const farm = await farmContract();
  const signer = await getSigner(1);
  const farm1 = farm.connect(signer);

  const blockNumber = await signer.provider?.getBlockNumber() as number;

  const percent = await farm.getInitRewardPercent(blockNumber);

  console.log(`percent ${percent.toNumber()}`);

})();

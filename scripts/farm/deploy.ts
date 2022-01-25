import {deploy} from '~/utils/upgrader';
import {Garden, Garden__factory} from '~/typechain';
import {getSigner} from '../../utils/contract';
import {parseEther} from 'ethers/lib/utils';
import {contractAddress} from '../../utils/contract';

(async () => {
  const signer = await getSigner(0);
  const currentBlock = (await signer.provider?.getBlockNumber()) as number;

  const factory = new Garden__factory(signer);

  const oneDayBlock = Math.ceil((24 * 3600) / 0.88);

  const instance = await factory.deploy(
    contractAddress.two,
    parseEther('1'),
    currentBlock + 100,
    currentBlock + oneDayBlock * 365 * 3,
    oneDayBlock
  );

  console.log(`farm deploy to: ${instance.address}`);
})();

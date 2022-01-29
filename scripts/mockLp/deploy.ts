import {parseEther} from 'ethers/lib/utils';
import {MockToken__factory} from '~/typechain';
import {getSigner} from '../../utils/contract';

(async () => {
  const signer = await getSigner(0);
  const factory = await new MockToken__factory(signer).deploy('two LP', 'twoLP', 18, parseEther('100000000000000'));
  console.log(`lp deploy ${factory.address}`);
})();

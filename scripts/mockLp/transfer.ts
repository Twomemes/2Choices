import {parseEther} from 'ethers/lib/utils';
import {ERC20__factory} from '../../typechain';
import {getSigner} from '../../utils/contract';

(async () => {
  const lp = await ERC20__factory.connect('0x8FCacfeFF8988c3e4792f585CCC148f67Ae29432', await getSigner());
  const tx = await lp.transfer('0x0536FeBA0B99E770943B600746d6271a9D792702', parseEther('1000000'));

  console.log(tx.hash);
})();

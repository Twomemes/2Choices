import {parseEther} from 'ethers/lib/utils';
import {ERC20__factory} from '../../typechain';
import {getSigner} from '../../utils/contract';

(async () => {
  const lp = await ERC20__factory.connect('0x432247280466bf16537dcE5817b24Ee945F3E43E', await getSigner());
  const tx = await lp.transfer('0x0536FeBA0B99E770943B600746d6271a9D792702', parseEther('1000000'));

  console.log(tx.hash);
})();

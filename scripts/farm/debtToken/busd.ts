import {getSigner} from '~/utils/contract';
import {IERC20__factory} from '~/typechain';
import {formatEther} from 'ethers/lib/utils';

const addr = '0x8427436a9c83BFf33bfBDC7b262Bd5Bd2ef00687';

(async () => {
  const signer = await getSigner(0);
  const token = IERC20__factory.connect(addr, signer);

  const bl = await token.balanceOf(signer.address);

  console.log(bl, formatEther(bl));
})();

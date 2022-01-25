import {IFairLaunch__factory, IERC20__factory} from '~/typechain';
import {getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const flAddr = '0xac2fefDaF83285EA016BE3f5f1fb039eb800F43D';
  const ibBnbAddr = '0xf9d32c5e10dd51511894b360e6bd39d7573450f9';

  const signer = await getSigner(0);

  const ibBnb = IERC20__factory.connect(ibBnbAddr, signer);

  const fairLaunch = IFairLaunch__factory.connect(flAddr, signer);
  const amount = parseEther('0.1');
  const dt = await fairLaunch.withdraw(signer.address, 1, amount);

  console.log(`deposit to fl ${dt.hash}`);
})();

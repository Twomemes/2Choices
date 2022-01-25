import {IBank__factory} from '~/typechain';
import {getSigner} from '../../utils/contract';
import {parseEther} from 'ethers/lib/utils';

async () => {
  const bank = IBank__factory.connect('0xf9d32C5E10Dd51511894b360e6bD39D7573450F9', await getSigner());

  const v = parseEther('0.001');
};

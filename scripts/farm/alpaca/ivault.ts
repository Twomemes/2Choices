import {IVault__factory, IVault, IERC20, IERC20__factory} from '~/typechain';
import {connect} from 'http2';
import {getSigner} from '../../../utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const signer = await getSigner(0);

  const vault = IVault__factory.connect('0xf9d32C5E10Dd51511894b360e6bD39D7573450F9', signer);

  const ibBnb = IERC20__factory.connect('0xf9d32C5E10Dd51511894b360e6bD39D7573450F9', signer);
  console.log(await ibBnb.name());
  console.log(await ibBnb.symbol());
  console.log(await ibBnb.totalSupply());
  console.log(await ibBnb.decimals());

  const token = await vault.token();

  const tx2 = await ibBnb.approve('0xac2fefDaF83285EA016BE3f5f1fb039eb800F43D', parseEther(`1${'0'.repeat(10)}`));

  console.log(tx2.hash);

  console.log(token);
})();

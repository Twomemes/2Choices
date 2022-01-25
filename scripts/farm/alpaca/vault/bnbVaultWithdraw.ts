import {IVault__factory, IVault, IERC20, IERC20__factory, MockValt__factory} from '~/typechain';
import {connect} from 'http2';
import {getSigner} from '~/utils/contract';
import {parseEther, formatEther} from 'ethers/lib/utils';

(async () => {
  const signer = await getSigner(0);

  const vault = MockValt__factory.connect('0xf9d32C5E10Dd51511894b360e6bD39D7573450F9', signer);

  const ibBnb = IERC20__factory.connect('0xf9d32C5E10Dd51511894b360e6bD39D7573450F9', signer);
  console.log(await ibBnb.name());
  console.log(await ibBnb.symbol());
  console.log(await ibBnb.totalSupply());
  console.log(await ibBnb.decimals());

  const totalSupply = await vault.totalSupply();
  const totalToken = await vault.totalToken();
  const v = parseEther('0.01');
  const ibv = v.mul(totalSupply).div(totalToken);
  console.log(formatEther(ibv));
  const tx2 = await vault.withdraw(ibv);
  console.log(tx2.hash);
})();

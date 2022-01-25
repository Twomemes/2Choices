import {IVault__factory, IVault, IERC20, IERC20__factory} from '~/typechain';
import {connect} from 'http2';
import {getSigner} from '~/utils/contract';
import {parseEther} from 'ethers/lib/utils';

(async () => {
  const signer = await getSigner(0);

  const vault = IVault__factory.connect('0xe5ed8148fE4915cE857FC648b9BdEF8Bb9491Fa5', signer);

  const ibBnb = IERC20__factory.connect('0xe5ed8148fE4915cE857FC648b9BdEF8Bb9491Fa5', signer);
  console.log(await ibBnb.name());
  console.log(await ibBnb.symbol());
  console.log(await ibBnb.totalSupply());
  console.log(await ibBnb.decimals());

  const token = await vault.token();
  console.log('valt token', token);

  const v = parseEther('0.001');
  // const tx2 = await vault.deposit(v, { value: v, });

  // console.log(tx2.hash)
})();

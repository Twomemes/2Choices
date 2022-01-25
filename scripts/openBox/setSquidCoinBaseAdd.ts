import {parseEther} from 'ethers/lib/utils';
import {squidOpenBoxContract, getSigner, busdContract} from '~/utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const openBox = await squidOpenBoxContract();

  const signer0 = await getSigner(0);
  const tx = await openBox.setSquidCoinBaseAdd(signer0.address);
  console.log(tx.hash);

  const busd = await busdContract();
  const tx2 = await busd.approve(openBox.address, parseEther(`10000`));
  console.log(tx2.hash);
})();

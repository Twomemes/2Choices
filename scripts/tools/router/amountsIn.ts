import { parseEther } from 'ethers/lib/utils';
import { IPancakeRouter02,IPancakeRouter02__factory } from "../../../typechain";
import { contractAddress, getSigner } from "../../../utils/contract";


(async ()=>{
  const signer = await getSigner( );


  const router = IPancakeRouter02__factory.connect('0xf491e7b69e4244ad4002bc14e878a34207e38c29' ,signer)
  const wftm = '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'

  const path = [
    wftm,
    contractAddress.two
  ]

  const out = parseEther('1')

  const amounts = await router.getAmountsIn(out, path)
  console.log(amounts)
})();

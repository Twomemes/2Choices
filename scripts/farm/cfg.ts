import { ERC20__factory } from "../../typechain";
import { getSigner } from "../../utils/contract";


export const addrs = {
  //测试 wftm: '0x432247280466bf16537dcE5817b24Ee945F3E43E',
  //测试 lp: '0x8FCacfeFF8988c3e4792f585CCC148f67Ae29432',
  wftm: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  lp: '0x40640062cf7a19557ed541df06f48bc7486eb8ba',
};

export async function lpContract() {
  const signer = await getSigner()
  const lp = ERC20__factory.connect(addrs.lp, signer);
  return lp;
}

export async function wftmContract() {
  const signer = await getSigner()
  const wftm = ERC20__factory.connect(addrs.wftm, signer);
  return wftm;

}


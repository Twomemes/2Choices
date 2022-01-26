import { ERC20__factory } from "../../typechain";
import { getSigner } from "../../utils/contract";


export const addrs = {
  wftm: '0x432247280466bf16537dcE5817b24Ee945F3E43E',
  lp: '0x8FCacfeFF8988c3e4792f585CCC148f67Ae29432',
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


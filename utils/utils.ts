import { BaseContract } from "ethers";
import { equal } from "./logutil";

export function toUnixSeconds(date: Date): number {
  return Math.ceil(date.getTime() / 1000);
}

export type CheckConfigItem = [string, string, any];

export async function checkConfig(
  contract: BaseContract,
  cfgs: CheckConfigItem[]
) {
  for (const cfg of cfgs) {
    const [getter, setter, value] = cfg;

    try {
      const onchain = await (<any>contract)[getter]();
      if (!equal(onchain, value)) {
        const tx = await (<any>contract)[setter](value);
        console.log(`${getter}: ${onchain} -> ${value}   ${tx.hash}`);
      }
    } catch (e) {
      console.error(cfg, e);
    }
  }
}

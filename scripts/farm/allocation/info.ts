import chalk from "chalk";
import { farmContract } from "../../../utils/contract";
import { equal } from "../../../utils/logutil";



(async () => {

  const farm = await farmContract();
  const total = await farm._totalAllocPoint();

  console.log(`total allocation point: ${chalk.red(total)}`);
  const pools = await farm.poolInfo();
  for (let i = 0; i < pools.length; i++) {
    const pool = pools[i];
    console.log(`pool ${chalk.cyan(i)} alloc point: ${chalk.cyanBright(pool.allocPoint)}`);
  }
  const vPools = await farm.virtualPoolInfo();
  for (let i = 0; i < vPools.length; i++) {
    const vPool = vPools[i];
    console.log(`vPool ${chalk.green(i)},alloc point: ${chalk.cyanBright(vPool.allocPoint)}`);
  }
})();

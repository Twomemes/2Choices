import chalk from "chalk";
import { farmContract } from "../../../utils/contract";
import { parseSheetWithType } from "../../../utils/googleDoc";
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

  const points = await parseSheetWithType<{
    name: string;
    allocation: number;
  }>('1bUGuozO32I4AxqEUVzT__WBUTZ6PRmzNY3jm7PEU_iI', 0, 0)


  const allocationByName = (name: string) => points?.find(x => x.name === name)?.allocation as number;

  const allocPoint = {
    wftmPool: allocationByName('wftm_pool[0]'),
    lpPool: allocationByName('LP_pool[1]'),
    squidGame: allocationByName('vpool[0]'),
    vpool1: allocationByName('vpool[1]')
  }

  console.log({allocPoint});

  if (!equal(vPools[0].allocPoint, allocPoint.squidGame)) {
    const tx = await farm.setVirtualAllocPoint(0, allocPoint.squidGame);
    console.log(`set squid game alloc point , from:${chalk.cyanBright(vPools[0].allocPoint)} to:${chalk.cyanBright(allocPoint.squidGame)} tx: ${tx.hash}`);
  }

  if (!equal(pools[0].allocPoint, allocPoint.wftmPool)) {
    const tx = await farm.setAllocPoint(0, allocPoint.wftmPool);
    console.log(`set wftm alloc point , from:${chalk.cyanBright(pools[0].allocPoint)} to:${chalk.cyanBright(allocPoint.wftmPool)} tx: ${tx.hash}`);
  }

  if (!equal(pools[1].allocPoint, allocPoint.lpPool)) {
    const tx = await farm.setAllocPoint(1, allocPoint.lpPool);
    console.log(`set lp alloc point , from:${chalk.cyanBright(pools[1].allocPoint)} to:${chalk.cyanBright(allocPoint.lpPool)} tx: ${tx.hash}`);
  }

  if(!equal(vPools[1].allocPoint, allocPoint.vpool1)){
    const tx = await farm.setVirtualAllocPoint(1, allocPoint.vpool1);
    console.log(`set vpool1 alloc point , from:${chalk.cyanBright(vPools[1].allocPoint)} to:${chalk.cyanBright(allocPoint.vpool1)} tx: ${tx.hash}`);
  }
})();

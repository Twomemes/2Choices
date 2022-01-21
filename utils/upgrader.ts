import { getSigner } from '~/utils/contract';
import chalk from 'chalk';
import { BaseContract, BigNumber, CallOverrides, ContractFactory, Overrides, Signer } from 'ethers';
import { ethers, network, upgrades } from 'hardhat';
import { bumpVersion, checkHasVersionFunction } from './bumpVersion';
import gitP, { SimpleGit } from 'simple-git/promise';
import { TransactionRequest } from '@ethersproject/providers';
import * as typechain from "~/typechain";

declare class MyContract extends BaseContract {
  version(overrides?: CallOverrides): Promise<BigNumber>;
}

declare class MyContractFactory extends ContractFactory {
  constructor(signer?: Signer);
  deploy(overrides?: Overrides & { from?: string | Promise<string> }): Promise<MyContract>;
  getDeployTransaction(overrides?: Overrides & { from?: string | Promise<string> }): TransactionRequest;
  attach(address: string): MyContract;
  connect(signer: Signer): MyContractFactory;
}

const manifestRepo = process.env['MANIFEST_REPO'] as any;

const origin = 'origin';
export async function upgrade(fileName: string, address: string, factory: MyContractFactory | any = null, check = true) {
  const name = fileName.split('.')[0];

  const narr = name.split('/');
  const fname = narr[narr.length - 1];
  if (!factory) {
    factory = (<any>typechain)[`${fname}__factory`];
  }

  const repo = gitP('./.openzeppelin');

  const branchName = `${name}-${network.name}`;

  // if (!(await repo.checkIsRepo())) {
  const rst = await repo.init();
  // }
  const r = await repo.remote(['-v']);
  if (!(r && r.includes(origin))) {
    await repo.addRemote(origin, manifestRepo);
  }

  if (check) {
    if (await (await repo.status()).isClean()) {
      try {
        await repo.fetch(origin, branchName);
        const ck = await repo.checkout(branchName);
      } catch (e) {
        console.log(`please prepare branch: ${chalk.cyan(branchName)} for manifest at ${chalk.green('.openzeppelin')}`);
        throw e;
      }
      await repo.pull(origin, branchName);
    } else {
      throw new Error(`mainifest repo not clean > .openzeppelin, please check`);
    }
  }
  const signer0 = (await ethers.getSigners())[0];
  const contract = await ethers.getContractAt(fname, address);
  let vb;
  try {

    vb = (await contract.version()).toString();
  } catch (e) {
    vb = ''
  }
  console.log(`will upgrade ${chalk.green(branchName)}, current version: ${chalk.cyan(vb)} address: ${address}`);
  const instance = await upgrades.upgradeProxy(address, new factory(signer0));
  console.log(`upgraded`)
  const version = await instance.version();
  const v = version.toString();
  console.log(`${chalk.green(fileName)} upgrade to ${chalk.green(v)} ${chalk.cyan(address)}`);

  if (check) {
    await repo.add('.');
    await repo.commit(`${name} - v${v}`);
    await repo.push(origin, branchName);
  }

  const nextv = await bumpVersion(fileName);
  console.log(`bump  version to ${chalk.cyan(nextv.toString())}`);
}



export async function deploy(
  fileName: string,
  // factory: MyContractFactory | any,
  args: any[] = [],
  factory: any = null,
  check = true
) {
  if (!(await checkHasVersionFunction(fileName))) {
    console.log(
      chalk.green(`
    function version() public pure returns (uint256) {
        return 0;
    }
		`)
    );
    throw new Error(`add version function for ${fileName}`);
  }
  const name = fileName.split(".")[0];

  const pn = name.split("/");
  const contractName = pn[pn.length - 1];

  if (!factory) {
    factory = (<any>typechain)[`${contractName}__factory`];
  }

  const repo = gitP("./.openzeppelin");
  const branchName = `${name}-${network.name}`;
  const rst = await repo.init();
  // }
  const r = await repo.remote(["-v"]);
  console.log({ remote: r, branchName });
  if (!(r && r.includes(origin))) {
    await repo.addRemote(origin, manifestRepo);
  }
  if (check) {
    if (await (await repo.status()).isClean()) {
      try {

        console.log(`git fetch ${origin} ${branchName}`)
        await repo.fetch(origin, branchName);
        // await repo.pull(origin, branchName);
        console.log(`git checkout ${branchName}`)
        await repo.checkout(branchName);
        console.log(`git merge ${origin}/${branchName} ${branchName}`);
        await repo.mergeFromTo(`${origin}/${branchName}`, branchName);
      } catch (e) {
        console.log(
          `branch: ${chalk.cyan(branchName)} not exists ${chalk.green(
            ".openzeppelin"
          )}`
        );
        const baseBranch = `${network.name}-base`;
        try {
          await repo.checkoutBranch(branchName, baseBranch);
          console.log(`checkout new branch ${chalk.green(branchName)}`);
        } catch (e) {
          console.log(`please prepare ${chalk.cyan(baseBranch)} branch`);
          throw e;
        }
      }
    } else {
      throw new Error(`mainifest repo not clean > .openzeppelin, please check`);
    }
  }
  console.log(`will deploy ${chalk.green(branchName)}`);
  const instance = await upgrades.deployProxy(
    new factory(await getSigner(0)),
    args
  );
  console.log(`${name} deploy to ${instance.address}`);
  const nextv = await bumpVersion(fileName);
  console.log(`bump  version to ${chalk.cyan(nextv.toString())}`);
  if (check) {
    await repo.add(".");
    await repo.commit(`${name} - v${nextv - 1} ${instance.address}`);
    await repo.push(origin, branchName);
  }
}

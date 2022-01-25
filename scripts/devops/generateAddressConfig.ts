import fs from 'fs/promises';
import {contractAddress, frontendUsedContracts, mutiContractAddrs} from '~/utils/contract';
import {network} from 'hardhat';

const genTypechainDir = `./typechain-tiny`;
const genTypechainFactoriesDir = `${genTypechainDir}/factories`;

async function cleanCode() {
  const indexFile = `${genTypechainDir}/index.ts`;
  const content = await fs.readFile(`./typechain/index.ts`, 'utf8');

  const lines = content.split('\n');

  const cleaned = lines.filter((l) => {
    return frontendUsedContracts.find((k) => l.includes(k));
  });
  await fs.writeFile(indexFile, cleaned.join('\n'));

  for (const d of ['./typechain', './typechain/factories']) {
    const files = await fs.readdir(d);
    for (const f of files) {
      if (frontendUsedContracts.find((k) => f.includes(k))) {
        const chosen = `${d}/${f}`;
        console.log(`chose ${chosen}`);
        if (chosen.includes('factories')) {
          const content = await fs.readFile(chosen, 'utf8');
          await fs.writeFile(
            `${genTypechainFactoriesDir}/${f}`,
            content
              .split('\n')
              .map((e) => {
                if (e.includes('static readonly bytecode =')) {
                  return 'static readonly bytecode ="";';
                } else {
                  return e;
                }
              })
              .join('\n')
          );
        } else if (!f.includes('index.ts')) {
          await fs.copyFile(chosen, `${genTypechainDir}/${f}`);
        }
      }
    }
  }
}

async function generateContractAddress() {
  const caddr = {} as any;
  for (const key in contractAddress) {
    if (!['new', 'old'].includes(key)) {
      caddr[key] = (<any>contractAddress)[key];
    }
  }
  caddr.FULL_CONTRACT_ADDRESS = mutiContractAddrs;

  caddr.__ENV__ = process.env.NPM_TAG;
  caddr.__VERSION__ = process.env.FULL_VERSION;
  caddr.__GIT_HASH__ = process.env.GIT_SHA;
  caddr.__GIT_COMMIT__ = process.env.GIT_COMMIT;
  caddr.__GIT_REF__ = process.env.GIT_REF;

  const body = JSON.stringify(caddr);
  const src = `export const contractAddress= ${body}; \n export default contractAddress;`;

  await fs.writeFile(`${genTypechainDir}/contractAddress.ts`, src);
  await fs.appendFile(`${genTypechainDir}/index.ts`, `\nexport { contractAddress } from "./contractAddress";`);
}

(async () => {
  try {
    const stat = await fs.stat(genTypechainFactoriesDir);
  } catch (err) {
    console.log(err);
    console.log(`create dir ${genTypechainFactoriesDir}`);
    await fs.mkdir(genTypechainFactoriesDir, {recursive: true});
  }

  await cleanCode();
  await generateContractAddress();
})();

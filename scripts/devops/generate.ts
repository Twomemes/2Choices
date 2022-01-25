import {network} from 'hardhat';
import chalk from 'chalk';
import * as typechain from '~/typechain';
import * as fs from 'fs/promises';
import {webToolsContractNames} from '~/utils/contract';
import fetch from 'node-fetch';
import gitP, {SimpleGit} from 'simple-git/promise';

const cookie = `notion_user_id=10268ab3-1772-4209-a5fc-8565e30f6e6e; notion_users=%5B%2210268ab3-1772-4209-a5fc-8565e30f6e6e%22%5D; notion_locale=en-US%2Flegacy; amplitude_id_af43d4b535912f7751949bfb061d8659notion.so=eyJkZXZpY2VJZCI6IjNjOWI3OTk4LWM1NjItNDE2OS1iOWI5LWUxNTRhOTZhNzAzY1IiLCJ1c2VySWQiOiIxMDI2OGFiMzE3NzI0MjA5YTVmYzg1NjVlMzBmNmU2ZSIsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTU5NTk5NDQ4OTg0NywibGFzdEV2ZW50VGltZSI6MTU5NTk5NDQ5MDM3NiwiZXZlbnRJZCI6NzQ1LCJpZGVudGlmeUlkIjo2NjQsInNlcXVlbmNlTnVtYmVyIjoxNDA5fQ==; notion_browser_id=eb5d1a71-3c01-4517-bac1-0abe1375c31b; NEXT_LOCALE=en-US; ajs_user_id=10268ab317724209a5fc8565e30f6e6e; token_v2=e96b2851a6373e83ece6af453d9d589d3ae5dea15584ada1f47004b82bdecc8071941b9ebc7097bcf08e6c732b466e388a19bd8e68111fb6943f56790be057fb2a2a7c2bfaabf41645a0549e25d8; logglytrackingsession=2c2c6a2a-4663-4561-beff-a2914666ef80; ajs_group_id=51a922e10f4543548983fe687066c060; ajs_anonymous_id=756dbec8-42fd-4ac0-84e7-c76856215e0b; intercom-session-gpfdrxfd=MlcxdDJnbldGVG1saGJ5YUEvTHcvaGJPUHN3NWE1dGFJRWJncmQ1K3JCY2tQRnB5Q01hSU4rd0R5bElmdWlIKy0tdkVqTVJVRVhPTTZMYkVldW5LcEx1dz09--0c20ce1227e2997ea7fd378793452b4d16234d09; _dd_s=rum=1&id=40e1e601-3eaa-4b44-8a30-2bc96043fbd8&created=1632643348158&expire=1632647804744`;

const webtoolsRepo = 'git@github.com:foxundermoon/web3-tools.git';

function prettyAndEscape(abi: any) {
  const prety = JSON.stringify(abi, null, 2);
  const abiEscaped = prety.replaceAll('\n', '\\n').replaceAll('"', '\\"');
  return abiEscaped;
}

async function copyAbiToWebTools() {
  const repoBase = `/Volumes/data/workspace/startup/bladegame/web-tools`;

  const repo = gitP(repoBase);
  if ((await repo.status()).isClean()) {
    await repo.checkout('kaki');
    for (const name of webToolsContractNames) {
      const abi = JSON.stringify((<any>typechain)[`${name}__factory`].abi);
      await fs.writeFile(`${repoBase}/contracts/${name}.json`, abi);
      console.log(`copy ${chalk.cyan(name)} to web-tools/contracts/${name}.json`);
    }
    await repo.add('.');
    await repo.commit('add abi');
    await repo.push('fox');
    console.log(`add abi to kaki brnach and push to github`);
  } else {
    throw new Error(`${repoBase} is not clean`);
  }
}

async function saveNotionTransactions(body: string) {
  const rst = await fetch('https://www.notion.so/api/v3/saveTransactions', {
    headers: {
      'content-type': 'application/json',
      cookie,
    },
    body,
    method: 'POST',
  });
  console.log(await rst.json());
}

async function main() {
  // await copyAbiToMetaProject();

  await copyAbiToWebTools();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

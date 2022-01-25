import * as fs from 'fs/promises';

export async function bumpVersion(fname: string) {
  let nextV = 0;
  const fpath = `contracts/${fname}`;
  const src = await fs.readFile(fpath, {encoding: 'utf8'});

  // https://regex101.com/r/veWlAS/1        /return\s+(\d+);/
  const lines = src.split('\n');
  // https://regex101.com/r/WVcqvj/1  /function\s+version\(\)/
  const versionIndex = lines.findIndex((l) => /function\s+version\(\)/.test(l));

  const target = lines.map((l, i) => {
    if (i === versionIndex + 1 && /return\s+(\d+);/.test(l)) {
      const match = /return\s+(\d+);/.exec(l);
      if (!match) {
        throw new Error(`Could not find version function on ${fname}`);
      }
      const v = match[1];
      nextV = parseInt(v) + 1;
      return `        return ${nextV};`;
    } else {
      return l;
    }
  });
  await fs.writeFile(fpath, target.join('\n'));
  return nextV;
}
export async function checkHasVersionFunction(fname: string) {
  const fpath = `contracts/${fname}`;
  const src = await fs.readFile(fpath, {encoding: 'utf8'});
  return /function\s+version\(\)/.test(src);
}

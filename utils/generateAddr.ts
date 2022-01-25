import type {mnemonicToSeedSync as mnemonicToSeedSyncT} from 'ethereum-cryptography/bip39';
import type {HDKey as HDKeyT} from 'ethereum-cryptography/hdkey';
import {
  bufferToHex,
  toBuffer,
  privateToAddress,
  rlp,
  generateAddress,
  keccak256,
  generateAddress2,
  Address,
  privateToPublic,
} from 'ethereumjs-util';
import {BigNumber, BigNumberish} from 'ethers';
import BN from 'bn.js';

export function deriveKeyFromMnemonicAndIndex(mnemonic: string, index: number) {
  return deriveKeyFromMnemonicAndPath(mnemonic, `m/44'/60'/0'/0/${index.toString()}`);
}
export function deriveKeyFromMnemonicAndPath(mnemonic: string, hdPath: string): Buffer | undefined {
  const {
    mnemonicToSeedSync,
  }: {
    mnemonicToSeedSync: typeof mnemonicToSeedSyncT;
  } = require('ethereum-cryptography/bip39');
  const seed = mnemonicToSeedSync(mnemonic);

  const {
    HDKey,
  }: {
    HDKey: typeof HDKeyT;
  } = require('ethereum-cryptography/hdkey');

  const masterKey = HDKey.fromMasterSeed(seed);
  const derived = masterKey.derive(hdPath);

  return derived.privateKey === null ? undefined : derived.privateKey;
}

export function deriveAccount(mnemonic: string, index: BigNumberish) {
  const pk = <Buffer>deriveKeyFromMnemonicAndIndex(mnemonic, Number(index));
  const publicKey = privateToPublic(pk);
  const address = bufferToHex(privateToAddress(pk)).toLowerCase();
  return {address, index, privateKey: bufferToHex(pk), publicKey: bufferToHex(publicKey)};
}

export function choseContractAddress(mnemonic: string) {
  let i = BigNumber.from(0);
  while (true) {
    const hdpath = `m/44'/60'/0'/0/${i.toString()}`;
    i = i.add(1);
    console.log(mnemonic);
    const pk = deriveKeyFromMnemonicAndPath(mnemonic, hdpath);
    if (pk) {
      const address = bufferToHex(privateToAddress(pk)).toLowerCase();
      const pks = bufferToHex(pk);
      console.log(address, pks);
    }
  }
}

export function generateContractAddressFor(sender: string, nonce: number) {
  const buffer = [Buffer.from(sender), nonce == 0 ? null : nonce];
  const addr = keccak256(rlp.encode(buffer)).toString('hex').slice(-40);
  return addr;
}

export function generateContractAddress(sender: string, nonce: number) {
  const n = new BN(toBuffer(nonce));

  return Address.generate(Address.fromString(sender), n as any).toString();

  // const addr = generateAddress(Address.fromString(sender).buf, new BN(nonce).toArrayLike(Buffer));
  // return bufferToHex(addr)
}

import {parseEther} from 'ethers/lib/utils';
import {contractAddress, squidAllowListContract, squidOpenBoxContract} from '~/utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const openBox = await squidOpenBoxContract();
  console.log('set List...');
  //const tx = await openBox.setClaimWhiteList(contractAddress.squidAllowList);
  //console.log(tx.hash);
  let a = [
    '0x8B12B7b9F963379b721D061af0BaF53bFfccF533',
    '0x5EeBD2f03424DCF5F0244a54b3b1E7BE65B7891D',
    '0x13e4cB2a40faAfA3e4D196492725f7e7A850737c',
    '0x163810fD0b04ba5422013969B7287321118F3F55',
    '0x62440E56cF828c65Ab0Db8f52523a18879e74Df3',
    '0x8918760945AD8499d5DE361f17B839686080d67e',
    '0x4EeB39d9d2Cc3b3A2eCE2e416829a582bb3058f2',
    '0x8682C90ba2705E4834B89313928d9aeEc0011dF2',
    '0xCc8b0b2296347305453B1D80a383d5597326614C',
    '0x43bFf8cb869EEF7D336453F68113B23Ed3220273',
    '0x9763771312dfED5BD8F14c224626be2aF6c4102A',
  ];

  const allowList = await squidAllowListContract();
  const tx2 = await allowList.tryAddAddresses(a);
  // const tx2 = await allowList.setupAdmin('0x8B52aB88dF16f88c4Ec885D89889C6deCAc7E221');
  console.log(tx2.hash);
})();

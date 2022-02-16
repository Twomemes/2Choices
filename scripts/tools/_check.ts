import { parseEther } from 'ethers/lib/utils';

import { CheckConfigItem, checkConfig } from "~/utils/utils";
import { network } from "hardhat";
import { getSigner, contractAddress, farmContract, toolsContract } from "~/utils/contract";
import { ERC20__factory, Tools__factory } from "../../typechain";


async function main() {
  const signer = await getSigner();
  const tools = await toolsContract();

  const wftm = '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83';
  const router = '0xf491e7b69e4244ad4002bc14e878a34207e38c29';
  console.log('tools address', tools.address);
  console.log(`farm`, contractAddress.farm);
  console.log(`two`, contractAddress.two);

  const cfgs: CheckConfigItem[] = [
    [
      "garden",
      "setGarden",
      contractAddress.farm,
    ],
    [
      'two',
      'setTwo',
      contractAddress.two
    ],
    // [
    //   'router',
    //   'setRouter',
    //   router
    // ],
    [
      'wftm',
      'setWftm',
      wftm
    ],
    [
      'twoFtmLp',
      'setTwoFtmLp',
      '0xb5d0e466953ac291cabb2eb9e11866c50f1e269f'
    ],
    [
      'ftmPrice',
      'setFtmPrice',
      18700
    ]
  ];

  await checkConfig(tools, cfgs);


  // for (const pair of [
  //   [contractAddress.two, router],
  //   [contractAddress.kakiBnbLP, contractAddress.farm],
  //   [wftm, router],
  // ]) {
  //   const erc20 = ERC20__factory.connect(pair[0], signer);
  //   const allowance = await erc20.allowance(tools.address, pair[1]);

  //   if (allowance.lt(parseEther('10000'))) {
  //     const tx = await tools.approve(pair[0], pair[1])
  //     console.log(`approve ${pair[0]} for ${pair[1]} ${tx.hash}`);
  //   }
  // }
}

main()

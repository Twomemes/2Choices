import { parseEther } from "@ethersproject/units";
import { isValidAddress } from "ethereumjs-util";
import _ from "lodash";
import { twoTokenContract } from "../../utils/contract";
import { airdropByGoogleDoc, parseSheetWithType } from "../../utils/googleDoc";



(async ()=>{


  const two = await twoTokenContract();

  const did ='1a25pNg-U4b96LoZiw8cNXuKVaf2znEp1CLSJVSPDbfg';

  const data = await parseSheetWithType<{
    HolderAddress: string;
    Balance:number;
  }>(did,0,0);

  const validData = data.filter(x=> isValidAddress(x.HolderAddress))
  .filter(x=>x.Balance> 1 && x.Balance< 3000 );

  const group = _.chunk(validData,200);

  for(let i=0;i<group.length;i++){
    const g = group[i];
    const tx = await two.batchTransferFrom('0xcBe6952d500E892Ed403894a8Dd06134daE9BD81',g.map(x=>x.HolderAddress),g.map(x=>parseEther(`${x.Balance}`)));
    console.log(`transfer chunk ${i} ${tx.hash}`);
  }



})();

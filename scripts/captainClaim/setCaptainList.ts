import {parseEther} from 'ethers/lib/utils';
import {captainClaimContract} from '~/utils/contract';
import {contractAddress} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';
// import _ from "lodash";

(async () => {
  console.log('setidList init');
  //const captain = await captainClaimContract();
  // const tokenIds = Array.from({length:2020}).map((e,i)=>i+1);
  // const group = _.chunk(tokenIds,500);
  for (var i = 0; i < 10; i++) {
    //const tx = await captain.setTokenIdList(1+200*i, 200*(1+i),{gasLimit: 5000000});
    //console.log('i:',i,tx.hash);
    console.log('i:', 1 + 200 * i, 200 * (1 + i));
  }
  //const tx = await captain.setTokenIdList(2001, 2020);
  //console.log(tx.hash);
})();

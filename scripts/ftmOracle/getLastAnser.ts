import { contractAddress, ftmOracleContract } from './../../utils/contract';
import { getSigner } from '~/utils/contract';

(async () => {
  const oracle = await ftmOracleContract();
  let a = await oracle.latestAnswer();
  console.log(a);
  
})();
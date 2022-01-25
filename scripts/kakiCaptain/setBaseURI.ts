import {parseEther} from 'ethers/lib/utils';
import {kakiCaptainContract} from '~/utils/contract';
import {contractAddress} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const ticket = await kakiCaptainContract();
  const tx = await ticket.setBaseTokenURI(
    'https://storageapi.fleek.co/b51bff0c-5cdc-4007-b7c4-0f4cacb79d54-bucket/2020URI/'
  );
  console.log(tx.hash);
})();

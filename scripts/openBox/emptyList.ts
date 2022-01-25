import {parseEther} from 'ethers/lib/utils';
import {contractAddress, squidAllowListContract, squidOpenBoxContract} from '~/utils/contract';
import {formatEther} from 'ethers/lib/utils';

(async () => {
  const openBox = await squidOpenBoxContract();

  const allowList = await squidAllowListContract();
  const len = await allowList.length();
  console.log(len.toString());
  for (let i = 0; i < Number(len); i++) {
    const address = await allowList.addressAt(i);
    const limit = await openBox.getClaimLimit(address);
    console.log(address, limit.toString());
    if (limit.eq(0)) {
    }
  }
  /*let a = [
    '0x62440e56cf828c65ab0db8f52523a18879e74df3',
    '0x56428C73C4fcc0C2B50b281C6f8858FE573BC5b9'];
    const  tx=await allowList.tryDeleteAddresses(a);
    console.log(tx.hash);*/
  //const limit=await openBox.getClaimLimit('0xe206189Dc09C52a32630A972B33b911205B45F89');
  //console.log(limit.toString());
})();

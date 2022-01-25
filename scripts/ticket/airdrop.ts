import {parseEther} from 'ethers/lib/utils';
import {squidTicketContract, getSigner} from '~/utils/contract';
import {busdContract, contractAddress} from '../../utils/contract';
import {formatEther} from 'ethers/lib/utils';
import {expect} from '~/test/chai-setup';

var to = [
  '0xF2f2D5975AC541762f9C243Cb5Cb5D877584AB9F',
  '0xA294878B65cB53173E570EfDc53bbf15f9b27385',
  '0xFFebfec27316F6e80fd5817D06F5A70783b83fFa',
  '0xa9192AeC8D9E604ab2D396c800385FF621FA63e2',
  '0xEA86248D1B351867C3a2baA13Dd3b230Fad7d1Fd',
  '0xc6fc4296a8F29D638eF0e334db46f134e518FE36',
  '0xDc40e8f7E00Cf4757162b0e5659572346D5E5E06',
  '0x1A5852c8BF5ef25EC695b8A0bD67EE2e340d618f',
  '0x3Ca8367257E51f2F3a3aD8426bD86c355AB54475',
  '0x8861a8312dA28682Ad99899478fe9017Cb1928F9',
  '0xE370f9CcE2eE7894D5b414bD20BcD16493Da4b74',
  '0x9762A2Fc9b09AF6CeB90b831fE1479b7b05306b0',
  '0x0a878386c1bbBfA36A7F1A166b5AcbAbe751313f',
  '0xb78c2B950B39DEf0d355433eD4ee96C40272288c',
  '0xb72AC06E54e8224036378672457551a99606d9d7',
  '0x676339b72E4B875965343bdbe8b17248D8b00B41',
  '0xC9092A7d8988E79BaDc84Aa15B56286c16a81C8B',
  '0x37296780686EaF469bbbc1474989af63338e16F9',
  '0x75b2621ecb4B9BA69742A27a85293dB91d7FcFfa',
  '0x3Fe899C3C23AB75C0BbF19B582Dc6C4B57fb5f61',
];

async function main() {
  const ticket = await squidTicketContract();

  const signer0 = await getSigner(0);
  const myTockets = await ticket.tokensOfOwner(signer0.address);

  expect(myTockets.length).eq(to.length);
  const tx = await ticket.batchTransfer(to, myTockets);

  console.log(tx.hash);
}

main();

import { Garden, ClaimLock, ClaimLock__factory, Garden__factory, MockSquid__factory, MockSquid, ERC20__factory, MockToken__factory } from '~/typechain';
import { deployments, ethers, getUnnamedAccounts, network, upgrades } from 'hardhat';
import { expect } from './chai-setup';
import { deployAll } from '~/utils/deployer';
import { setupUsers } from './utils';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { printEtherResult } from '../utils/logutil';
import { getSigner } from '~/utils/contract';
import { toBuffer, fromUtf8, bufferToHex, zeroAddress } from 'ethereumjs-util';
import { BigNumber } from '@ethersproject/bignumber';
import delay from 'delay';

const setup = deployments.createFixture(async () => {
  const signer = await getSigner();
  const squid = <MockSquid>await new MockSquid__factory(signer).deploy();

  const singers = await ethers.getSigners();
  const accounts = singers.map((e) => e.address);
  const users = await setupUsers(accounts, {
    squid,
  });

  return {
    users,
    squid
  };
});

describe('squid', async () => {



  it('squid -> getAward', async () => {
    const { users, squid} = await setup();

    let award=await squid.getAward();
    console.log(award);

  });


});

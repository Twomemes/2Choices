

## upgrade
```
git clone git@github.com:derivative-lab/kaki-mono.sol.openzeppelin.git .openzeppelin

yarn  ht scripts/openBox/upgrade.ts
```

## verify

```
yarn hardhat verify --network ftm --contract contracts/two/TwoToken.sol:TwoToken  0x9F1851f29374eFb292cFa78503fc02A9b640c45b
yarn hardhat verify --network ftm --contract contracts/adminLock/AdminLock.sol:AdminLock 0x68B0a62a629E2aC0d4bf8D4B606C7ba8596F4D01 '0xb5D0e466953aC291CABb2eB9E11866c50F1E269f' '0xe8Ee8218DDE80329aFCEA84B42705aF2a6B8c70C' '0x2A93a76b799fAe50ff4853fE74E31e2aBe92F300' '0x25c520C0A4438897032aeB0C15E2aF1088BEdbFd'
```

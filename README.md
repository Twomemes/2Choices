

## upgrade
```
git clone git@github.com:derivative-lab/kaki-mono.sol.openzeppelin.git .openzeppelin

yarn  ht scripts/openBox/upgrade.ts
```

## verify

```
yarn hardhat verify --network ftm --contract contracts/two/TwoToken.sol:TwoToken  0x9F1851f29374eFb292cFa78503fc02A9b640c45b
```

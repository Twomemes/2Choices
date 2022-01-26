

## upgrade
```
git clone git@github.com:derivative-lab/kaki-mono.sol.openzeppelin.git .openzeppelin

yarn  ht scripts/openBox/upgrade.ts
```

## verify

```
yarn hardhat verify --network ftm --contract contracts/two/TwoToken.sol:TwoToken  0xd91cfd064F4C1a9ee91Fc58fCa671c4cF6A68ADB
```

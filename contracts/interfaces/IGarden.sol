pragma solidity ^0.8.0;

import "./IERC20.sol";
import {IDebtToken} from "./IDebtToken.sol";
import {IVault} from "./IVault.sol";
import {IFairLaunch} from "./IFairLaunch.sol";

// interface IBank {
/****

  deposit bnb  https://bscscan.com/tx/0xed9eb236e93ef2cae6fa3ad055020ab29a9e41ceb8c88c225d409d4b98f6975a
     bnb  bank                  0xd7d069493685a581d27824fc46eda46b7efc0063
    ibBNB  0xd7d069493685a581d27824fc46eda46b7efc0063
  Interest Bearing BUSD 0x7c9e73d4c71dae564d41f78d56439bb4ba87592f

   deposit ibBUSD  https://bscscan.com/tx/0x68dbd2ff58efc4eb90b55800900e4cfb80e9d74ba6c1e846901a3bd98015de9e
    Alpaca Finance: Fairlaunch 0xa625ab01b08ce023b2a342dbb12a16f2c8489a8f
     */
// function deposit(uint256 amount) external payable;

//     function withdraw(uint256 amount) external;
// }

interface IGarden {
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event Harvest(address indexed user, uint256 indexed pid, uint256 amount);
    event HarvestMany(address indexed user, uint256[] pids, uint256[] amounts);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);
    // Info of each user.
    struct UserInfo {
        uint256 amount; // How any LP tokens the user has provided.
        uint256 rewardDebt;
    }

    // Info of each pool.
    struct PoolInfo {
        address token; // Address of LP token contract.
        uint256 allocPoint; // How many allocation points assigned to this pool. OXDs to distribute per block.
        uint256 lastRewardBlock; // Last block time that OXDs distribution occurs.
        uint256 accTwoPerShare; // Accumulated OXDs per share, times 1e12. See below.
    }

    function harvest(uint256 pid) external;

    // function harvestMany(uint256[] memory pids) external;

    function withdraw(uint256 pid, uint256 amount) external;

    function deposit(uint256 pid, uint256 amount) external payable;

    function pendingReward(uint256 pid, address user) external view returns (uint256);
    function emergencyWithdraw(uint256 pid) external ;

    // function dailyReward(uint256 pid) external view returns (uint256);

    function poolInfo() external view returns (PoolInfo[] memory);

    // function poolApr(uint256 pid) external view returns (uint256);
    // function withdrawAll(uint256 pid) external;
}

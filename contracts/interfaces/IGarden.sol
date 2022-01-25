pragma solidity ^0.8.0;

interface IGarden {
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event HarvestAll(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);
    // Info of each user.
    struct UserInfo {
        uint256 amount; // How any LP tokens the user has provided.
        uint256 rewardDebt;
        uint256 depositTime;
    }

    // Info of each pool.
    struct PoolInfo {
        address token; // Address of LP token contract.
        uint256 allocPoint; // How many allocation points assigned to this pool. OXDs to distribute per block.
        uint256 lastRewardBlock; // Last block time that OXDs distribution occurs.
        uint256 accTwoPerShare; // Accumulated OXDs per share, times 1e12. See below.
    }

    function harvestAll() external;

    function withdraw(uint256 pid, uint256 amount) external;

    function deposit(uint256 pid, uint256 amount) external payable;

    function pendingReward(uint256 pid, address user) external view returns (uint256);

    function emergencyWithdraw(uint256 pid) external;

    function poolInfo() external view returns (PoolInfo[] memory);

    function squidPoolCalim() external returns (uint256);
}

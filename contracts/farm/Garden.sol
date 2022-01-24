pragma solidity ^0.8.0;

import "../base/WithAdminRole.sol";
import "../interfaces/IERC20.sol";
import {IGarden} from "../interfaces/IGarden.sol";
import "../interfaces/IClaimLock.sol";
// import {DebtToken} from "./DebtToken.sol";
// import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
// import {IVault} from "../interfaces/IVault.sol";
// import {IFairLaunch} from "../interfaces/IFairLaunch.sol";

import {ITwoToken} from "../interfaces/ITwoToken.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
// import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "../libraries/SafeToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Garden is IGarden, ReentrancyGuard, Ownable {
    // using SafeERC20Upgradeable for IERC20;
    using SafeToken for address;
    // start mine block number
    uint256 public _startBlockNumber;
    uint256 public _endBlockNumber;
    uint256 public _oneDayBlocks;
    // total allocation point
    uint256 public _totalAllocPoint;
    uint256 public _rewardPerBlock;
    ITwoToken public _twoToken;
    IClaimLock public _rewardLocker;
    mapping(address => uint256) public _poolId1; // poolId1 starting from 1,subtract 1 before using with poolInfo
    // Info of each user that stakes LP tokens. pid => user address => info
    mapping(uint256 => mapping(address => UserInfo)) public _userInfo;
    // Info of each pool.
    PoolInfo[] public _poolInfo;
    uint256[] public _rewardMultiplier;

    // function initialize(
    //     ITwoToken twoToken,
    //     uint256 rewardPerBlock,
    //     uint256 startBlock
    // ) public initializer {
    //     __WithAdminRole_init();
    //     __ReentrancyGuard_init();
    //     __Pausable_init();
    //     // _rewardToken = rewardToken;
    //     _rewardPerBlock = rewardPerBlock;
    //     _startBlockNumber = startBlock;
    //     _oneDayBlocks = 22656;
    //     _twoToken = twoToken;
    // }

    constructor(
        ITwoToken twoToken,
        uint256 rewardPerBlock,
        uint256 startBlock
    ) {
        _rewardPerBlock = rewardPerBlock;
        _startBlockNumber = startBlock;
        _oneDayBlocks = 22656;
        _twoToken = twoToken;
        _rewardMultiplier = [32, 16, 14, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1];
    }

    function setRewardLocker(IClaimLock rewardLocker) public onlyOwner {
        _rewardLocker = rewardLocker;
    }

    function setOneDayBlocks(uint256 oneDayBlocks) public onlyOwner {
        _oneDayBlocks = oneDayBlocks;
    }

    function setEndBlockNumber(uint256 endBlockNumber) public onlyOwner {
        _endBlockNumber = endBlockNumber;
    }

    function setStartBlockNumber(uint256 startBlockNumber) public onlyOwner {
        _startBlockNumber = startBlockNumber;
    }

    function setRewardPerBlock(uint256 rewardPerBlock) public onlyOwner {
        _rewardPerBlock = rewardPerBlock;
    }

    function addPool(uint256 allocPoint, address token) external onlyOwner {
        checkForDuplicate(token); // ensure you cant add duplicate pools
        massUpdatePools();
        uint256 lastRewardBlock = block.number > _startBlockNumber ? block.number : _startBlockNumber;
        _totalAllocPoint += allocPoint;
        _poolInfo.push(
            PoolInfo({token: token, allocPoint: allocPoint, lastRewardBlock: lastRewardBlock, accTwoPerShare: 0})
        );
    }

    function set(uint256 pid, uint256 allocPoint) external onlyOwner {
        massUpdatePools();
        _totalAllocPoint = _totalAllocPoint - _poolInfo[pid].allocPoint + allocPoint;
        _poolInfo[pid].allocPoint = allocPoint;
    }

    function checkForDuplicate(address token) internal view {
        uint256 length = _poolInfo.length;
        for (uint256 pid; pid < length; pid++) {
            require(_poolInfo[pid].token != token, "add: pool already exists!!!!");
        }
    }

    function getWeekth(uint256 blockNumber) public view returns (uint256) {
        if (blockNumber < _startBlockNumber) {
            return 0;
        }
        return (blockNumber - _startBlockNumber) / (_oneDayBlocks * 7);
    }

    function currentWeekth() public view returns (uint256) {
        return getWeekth(block.number);
    }

    function getMultiplier(uint256 from, uint256 to) public view returns (uint256) {
        console.log("from,to:", from, to);
        if (to < _startBlockNumber) {
            return 0;
        }
        if (from < _startBlockNumber) {
            from = _startBlockNumber;
        }
        if (to > _endBlockNumber) {
            to = _endBlockNumber;
        }
        uint256 weekth = getWeekth(to);
        console.log("weekth,_rewardMultiplier.length:", weekth, _rewardMultiplier.length);
        // return _rewardMultiplier[0];
        uint256 multiplier = weekth > _rewardMultiplier.length - 1 ? 1 : _rewardMultiplier[weekth];
        // return multiplier;
        console.log("multiplier:", multiplier);
        console.log("to", to);
        console.log("from", from);
        console.log("to-from", to - from);
        return multiplier * (to - from);
    }

    function pendingReward(uint256 pid, address user) public view override returns (uint256) {
        PoolInfo storage pool = _poolInfo[pid];
        UserInfo storage user = _userInfo[pid][user];
        uint256 accTwoPerShare = pool.accTwoPerShare;
        uint256 lpSupply = pool.token.myBalance();
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
            uint256 twoReward = (multiplier * _rewardPerBlock * pool.allocPoint) / _totalAllocPoint;
            accTwoPerShare = accTwoPerShare + (twoReward * 1e12) / lpSupply;
            //  accTwoPerShare.add(oxdReward.mul(1e12).div(lpSupply));
        }
        // return user.amount.mul(accOXDPerShare).div(1e12).sub(user.rewardDebt);
        return (user.amount * accTwoPerShare) / 1e12 - user.rewardDebt;
    }

    function massUpdatePools() public {
        uint256 length = _poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    function updatePool(uint256 pid) public {
        PoolInfo storage pool = _poolInfo[pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.token.myBalance();
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        uint256 twoReward = (multiplier * _rewardPerBlock * pool.allocPoint) / _totalAllocPoint;
        _twoToken.mint(address(this), twoReward);
        pool.accTwoPerShare = pool.accTwoPerShare + (twoReward * 1e12) / lpSupply;
        pool.lastRewardBlock = block.number;
    }

    function deposit(uint256 pid, uint256 amount) public payable override nonReentrant {
        uint256 currentBlock = block.number;
        require(currentBlock >= _startBlockNumber, "not begin yet");
        UserInfo storage user = _userInfo[pid][msg.sender];
        if (user.amount > 0) {
            _harvest(pid);
        }
        // user.rewardAtBlock = currentBlock;
        PoolInfo storage poolInfo = _poolInfo[pid];

        user.amount += amount;
        // poolInfo.stakingAmount += amount;
        // poolInfo.debtToken.mint(msg.sender, amount);
        emit Deposit(msg.sender, pid, amount);
    }

    function withdraw(uint256 pid, uint256 amount) public override nonReentrant {
        _withdraw(pid, amount);
    }

    function _withdraw(uint256 pid, uint256 amount) internal {
        require(amount > 0, "amount cannot be zero");
        address userAddr = msg.sender;
        UserInfo storage user = _userInfo[pid][userAddr];
        require(user.amount >= amount, "out of staking");
        _harvest(pid);
        PoolInfo storage poolInfo = _poolInfo[pid];

        uint256 realWithdraw;

        // poolInfo.debtToken.burn(userAddr, amount);
        user.amount -= amount;
        // poolInfo.stakingAmount -= amount;
        emit Withdraw(userAddr, pid, amount);
    }

    function harvest(uint256 pid) public override nonReentrant {
        _harvest(pid);
    }

    function _harvest(uint256 pid) internal {}

    function poolInfoLength() public view returns (uint256) {
        return _poolInfo.length;
    }

    function poolInfo() public view override returns (PoolInfo[] memory) {
        return _poolInfo;
    }

    receive() external payable {}

    function safeTwoTransfer(address to, uint256 amount) internal {
        uint256 twoBal = _twoToken.balanceOf(address(this));
        if (amount > twoBal) {
            _twoToken.transfer(to, twoBal);
        } else {
            _twoToken.transfer(to, amount);
        }
    }

    function emergencyWithdraw(uint256 pid) public override {
        PoolInfo storage pool = _poolInfo[pid];
        UserInfo storage user = _userInfo[pid][msg.sender];

        uint256 oldUserAmount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
        pool.token.safeTransfer(msg.sender, oldUserAmount);
        emit EmergencyWithdraw(msg.sender, pid, oldUserAmount);
    }

    function version() public pure returns (uint256) {
        return 30;
    }
}

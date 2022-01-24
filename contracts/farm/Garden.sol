pragma solidity ^0.8.0;

import "../base/WithAdminRole.sol";
import "../interfaces/IERC20.sol";
import {IGarden} from "../interfaces/IGarden.sol";
import "../interfaces/IClaimLock.sol";
import {ITwoToken} from "../interfaces/ITwoToken.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../libraries/SafeToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Garden is IGarden, ReentrancyGuard, Ownable {
    using SafeToken for address;
    // start mine block number
    uint256 public _startBlockNumber;
    uint256 public _endBlockNumber;
    uint256 public _oneDayBlocks;
    // total allocation point
    uint256 public _totalAllocPoint;
    uint256 public _rewardPerBlock;
    uint256 public  _initRewardPercent;
    ITwoToken public _twoToken;
    IClaimLock public _rewardLocker;
    // Info of each user that stakes LP tokens. pid => user address => info
    mapping(uint256 => mapping(address => UserInfo)) public _userInfo;
    // Info of each pool.
    PoolInfo[] public _poolInfo;
    uint256[] public _rewardMultiplier;

    constructor(
        ITwoToken twoToken,
        uint256 rewardPerBlock,
        uint256 startBlock,
        uint256 endBlock,
        uint256 oneDayBlocks
    ) {
        _rewardPerBlock = rewardPerBlock;
        _startBlockNumber = startBlock;
        _endBlockNumber = endBlock;
        _oneDayBlocks = oneDayBlocks;
        _twoToken = twoToken;
        _rewardMultiplier = [32, 16, 14, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1];
        _initRewardPercent = 22;
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
    function setRewardMultiplier(uint256[] memory multiplier) public onlyOwner {
        _rewardMultiplier = multiplier;
    }
    function setInitRewardPercent(uint256 percent) public onlyOwner {
        _initRewardPercent = percent;
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
        for (uint256 pid; pid < length; pid++) {
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
        PoolInfo storage pool = _poolInfo[pid];
        UserInfo storage user = _userInfo[pid][msg.sender];
        updatePool(pid);
        uint256 pending = ((user.amount * pool.accTwoPerShare) / 1e12) - user.rewardDebt;
        user.amount += amount;
        user.rewardDebt = (user.amount * pool.accTwoPerShare) / 1e12;
        if (pending > 0) {
            safeTwoTransfer(msg.sender, pending);
        }
        pool.token.safeTransferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, pid, amount);
    }

    function withdraw(uint256 pid, uint256 amount) public override nonReentrant {
        PoolInfo storage pool = _poolInfo[pid];
        UserInfo storage user = _userInfo[pid][msg.sender];

        require(user.amount >= amount, "over withdraw");

        updatePool(pid);

        uint256 pending = (user.amount * pool.accTwoPerShare) / 1e12 - user.rewardDebt;

        user.amount -= amount;
        user.rewardDebt = (user.amount * pool.accTwoPerShare) / 1e12;

        if (pending > 0) {
            safeTwoTransfer(msg.sender, pending);
        }
        pool.token.safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, pid, amount);
    }

    function harvestAll() public override {
        uint256 length = _poolInfo.length;
        uint256 calc;
        uint256 pending;
        UserInfo storage user;
        PoolInfo storage pool;
        uint256 totalPending;
        for (uint256 pid = 0; pid < length; ++pid) {
            user = _userInfo[pid][msg.sender];
            if (user.amount > 0) {
                pool = _poolInfo[pid];
                updatePool(pid);

                calc = (user.amount * pool.accTwoPerShare) / 1e12;
                pending = calc - user.rewardDebt;
                user.rewardDebt = calc;

                if (pending > 0) {
                    totalPending += pending;
                }
            }
        }
        if (totalPending > 0) {
            safeTwoTransfer(msg.sender, totalPending);
        }
    }

    function poolInfoLength() public view returns (uint256) {
        return _poolInfo.length;
    }

    function poolInfo() public view override returns (PoolInfo[] memory) {
        return _poolInfo;
    }

    function safeTwoTransfer(address to, uint256 amount) internal {
        uint256 twoBal = _twoToken.balanceOf(address(this));
        uint256 sending = (amount * _initRewardPercent) / 100;
        if (sending > twoBal) {
            _twoToken.transfer(to, twoBal);
        } else {
            _twoToken.transfer(to, sending);
            uint256 locked = twoBal - sending;
            _twoToken.transfer(address(_rewardLocker), locked);
            _rewardLocker.lockFarmReward(to, locked);
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
}

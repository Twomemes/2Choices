pragma solidity ^0.8.0;

import "../base/WithAdminRole.sol";
import "../interfaces/IERC20.sol";
import {IKakiGarden} from "../interfaces/IKakiGarden.sol";
import "../interfaces/IClaimLock.sol";
import {DebtToken} from "./DebtToken.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {IVault} from "../interfaces/IVault.sol";
import {IFairLaunch} from "../interfaces/IFairLaunch.sol";

import "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "../libraries/SafeToken.sol";

contract KakiGarden is IKakiGarden, WithAdminRole, ReentrancyGuardUpgradeable, PausableUpgradeable {
    using SafeERC20Upgradeable for IERC20;
    // start mine block number
    uint256 public _startBlockNumber;
    uint256 public _oneDayBlocks;
    // total allocation point
    uint256 public _totalAllocPoint;
    uint256 public _rewardPerBlock;
    uint256 public _rewardTokenPrice;
    // IERC20 public _rewardToken;
    IClaimLock public _rewardLocker;
    mapping(address => uint256) public _poolId1; // poolId1 starting from 1,subtract 1 before using with poolInfo
    // Info of each user that stakes LP tokens. pid => user address => info
    mapping(uint256 => mapping(address => UserInfo)) public _userInfo;
    // Info of each pool.
    PoolInfo[] public _poolInfo;

    function initialize(
        // IERC20 rewardToken,
        uint256 rewardPerBlock,
        uint256 startBlock
    ) public initializer {
        __WithAdminRole_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        // _rewardToken = rewardToken;
        _rewardPerBlock = rewardPerBlock;
        _startBlockNumber = startBlock;
        _oneDayBlocks = 22656;
    }

    function setRewardLocker(IClaimLock rewardLocker) public restricted {
        _rewardLocker = rewardLocker;
    }

    function setOneDayBlocks(uint256 oneDayBlocks) public restricted {
        _oneDayBlocks = oneDayBlocks;
    }

    function setRewardTokenPrice(uint256 rewardTokenPrice) public restricted {
        _rewardTokenPrice = rewardTokenPrice;
    }

    function addPool(
        uint256 allocPoint,
        IERC20 token,
        uint256 price,
        IVault vault,
        IERC20 ibToken,
        IFairLaunch fairLaunch,
        uint256 flPid,
        bool isNative,
        string memory name
    ) public restricted {
        require(_poolId1[address(token)] == 0, "addPool: token is already in pool");

        uint256 pl = _poolInfo.length;
        _poolId1[address(token)] = pl + 1;

        _poolInfo.push(
            PoolInfo({
                allocPoint: allocPoint,
                pid: pl,
                stakingAmount: 0,
                token: token,
                price: price,
                debtToken: new DebtToken(
                    string(abi.encodePacked("k", token.name())),
                    string(abi.encodePacked("k", token.symbol()))
                ),
                vault: vault,
                ibToken: ibToken,
                fairLaunch: fairLaunch,
                flPid: flPid,
                isNative: isNative,
                name: name
            })
        );
        _totalAllocPoint += allocPoint;
        if (address(token) != address(0)) {
            token.approve(address(vault), type(uint256).max);
        }
        if (address(ibToken) != address(0)) {
            ibToken.approve(address(fairLaunch), type(uint256).max);
        }
    }

    function deposit(uint256 pid, uint256 amount) public payable override whenNotPaused nonReentrant {
        uint256 currentBlock = block.number;
        require(currentBlock >= _startBlockNumber, "not begin yet");
        UserInfo storage user = _userInfo[pid][msg.sender];
        if (user.amount > 0) {
            _harvest(pid);
        }
        user.rewardAtBlock = currentBlock;
        PoolInfo storage poolInfo = _poolInfo[pid];
        if (poolInfo.isNative) {
            require(amount == msg.value, "deposit amount must be equal to msg.value");
        } else {
            poolInfo.token.safeTransferFrom(msg.sender, address(this), amount);
        }

        IVault vault = poolInfo.vault;
        if (address(vault) != address(0)) {
            if (poolInfo.isNative) {
                vault.deposit{value: amount}(amount);
            } else {
                vault.deposit(amount);
            }

            IFairLaunch fairLaunch = poolInfo.fairLaunch;
            if (address(fairLaunch) != address(0)) {
                fairLaunch.deposit(address(this), poolInfo.flPid, poolInfo.ibToken.balanceOf(address(this)));
            }
        }
        user.amount += amount;
        poolInfo.stakingAmount += amount;
        poolInfo.debtToken.mint(msg.sender, amount);
        emit Deposit(msg.sender, pid, amount);
    }

    function withdraw(uint256 pid, uint256 amount) public override whenNotPaused nonReentrant {
        _withdraw(pid, amount);
    }

    // function withdrawAll(uint256 pid) public override whenNotPaused nonReentrant {
    //     _harvest(pid);
    //     UserInfo storage user = _userInfo[pid][msg.sender];
    //     PoolInfo storage poolInfo = _poolInfo[pid];
    //     uint256 amount = user.amount;
    //     poolInfo.token.transfer(msg.sender, amount);
    //     poolInfo.debtToken.burn(msg.sender, amount);
    //     user.amount = 0;
    //     poolInfo.stakingAmount -= amount;
    //     emit Withdraw(msg.sender, pid, amount);
    // }

    function _withdraw(uint256 pid, uint256 amount) internal {
        require(amount > 0, "amount cannot be zero");
        address userAddr = msg.sender;
        UserInfo storage user = _userInfo[pid][userAddr];
        require(user.amount >= amount, "out of staking");
        _harvest(pid);
        PoolInfo storage poolInfo = _poolInfo[pid];
        if (address(poolInfo.vault) != address(0)) {
            IVault vault = poolInfo.vault;
            uint256 tokenAmount = (amount * vault.totalSupply()) / vault.totalToken();
            IFairLaunch fairLaunch = poolInfo.fairLaunch;
            if (address(fairLaunch) != address(0)) {
                fairLaunch.withdraw(address(this), poolInfo.flPid, tokenAmount);
            }
            poolInfo.vault.withdraw(amount);
        }

        uint256 realWithdraw;
        if (poolInfo.isNative) {
            realWithdraw = MathUpgradeable.min(address(this).balance, amount);
            SafeToken.safeTransferETH(userAddr, realWithdraw);
        } else {
            IERC20 token = poolInfo.token;
            realWithdraw = MathUpgradeable.min(token.balanceOf(address(this)), amount);
            token.safeTransfer(userAddr, realWithdraw);
        }
        poolInfo.debtToken.burn(userAddr, amount);
        user.amount -= amount;
        poolInfo.stakingAmount -= amount;
        emit Withdraw(userAddr, pid, amount);
    }

    function harvest(uint256 pid) public override nonReentrant whenNotPaused {
        _harvest(pid);
    }

    function _harvest(uint256 pid) internal {
        uint256 rAmount = onlyHarvest(pid);
        if (rAmount > 0) {
            _rewardLocker.lockFarmReward(msg.sender, rAmount);
        }
        emit Harvest(msg.sender, pid, rAmount);
    }

    function harvestMany(uint256[] memory pids) public override whenNotPaused nonReentrant {
        uint256 pl = pids.length;
        require(pl > 0, "empoty pids");

        uint256 rAmountTotal;
        uint256[] memory rAmounts = new uint256[](pl);
        for (uint256 i; i < pl; i++) {
            uint256 samount = onlyHarvest(pids[i]);
            rAmountTotal += samount;
            rAmounts[i] = samount;
        }

        if (rAmountTotal > 0) {
            _rewardLocker.lockFarmReward(msg.sender, rAmountTotal);
        } else {
            revert("empty staking");
        }
        emit HarvestMany(msg.sender, pids, rAmounts);
    }

    function pendingReward(uint256 pid) public view override returns (uint256) {
        PoolInfo memory pool = _poolInfo[pid];
        UserInfo memory user = _userInfo[pid][msg.sender];
        if (user.amount > 0) {
            return (_rewardPerBlock * (block.number - user.rewardAtBlock) * pool.allocPoint) / _totalAllocPoint;
        }
    }

    function dailyReward(uint256 pid) public view override returns (uint256) {
        return (_rewardPerBlock * _oneDayBlocks * _poolInfo[pid].allocPoint) / _totalAllocPoint;
    }

    function onlyHarvest(uint256 pid) internal returns (uint256 rAmount) {
        PoolInfo storage pool = _poolInfo[pid];
        UserInfo storage user = _userInfo[pid][msg.sender];
        if (user.amount > 0) {
            uint256 currentBlock = block.number;
            rAmount = (_rewardPerBlock * (currentBlock - user.rewardAtBlock) * pool.allocPoint) / _totalAllocPoint;
            user.rewardAtBlock = currentBlock;
        } else {
            revert("no staking");
        }
    }

    function poolInfoLength() public view returns (uint256) {
        return _poolInfo.length;
    }

    function poolInfo() public view override returns (PoolInfo[] memory) {
        return _poolInfo;
    }

    function poolApr(uint256 pid) public view override returns (uint256) {
        PoolInfo memory pool = _poolInfo[pid];
        if (pool.stakingAmount == 0) {
            return 0;
        }

        return
            (((_rewardPerBlock * _oneDayBlocks * pool.allocPoint) / _totalAllocPoint) *
                _rewardTokenPrice *
                365 *
                10000) / (pool.stakingAmount * pool.price);
    }

    function approve(IERC20 token, address spender) public restricted {
        token.approve(spender, type(uint256).max);
    }

    receive() external payable {}

    function version() public pure returns (uint256) {
        return 29;
    }
}

pragma solidity ^0.8.0;
import "../interfaces/IClaimLock.sol";
import "../interfaces/ITwoToken.sol";
import "../interfaces/IERC20.sol";
import "../base/WithAdminRole.sol";

contract ClaimLock is IClaimLock, WithAdminRole {
    ITwoToken public _two;
    uint256 constant THOUSAND = 10**3;
    uint256 public _startTime;
    uint256 public _tradingStartTime;
    uint256 public _farmPeriod;
    uint256 public _tradingPeriod;
    address public _addFarm;
    address public _treasury;

    bool internal locked;

    mapping(address => LockedFarmReward[]) public _userLockedFarmRewards;
    mapping(address => uint256) public _userFarmLockedAmount;
    event ClaimFarmReward(address indexed user, uint256 unlockedAmount, uint256 lockedAmount);

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    modifier isFarm() {
        require(msg.sender == _addFarm, "Invalid address.");
        _;
    }

    function initialize(address farmAdd, ITwoToken kTokenAdd) public initializer {
        __WithAdminRole_init();
        // block number
        _farmPeriod = 9800000;
        _addFarm = farmAdd;
        _two = kTokenAdd;
    }

    function lockFarmReward(address account, uint256 amount) public override isFarm {
        uint256 currentBlockNumber = block.number;
        _userFarmLockedAmount[account] += amount;
        _userLockedFarmRewards[account].push(
            LockedFarmReward({_locked: amount, _blockNumber: currentBlockNumber, _currentTime: block.timestamp})
        );
    }

    function claimFarmReward(uint256[] memory indexes) public override noReentrant {
        uint256 len = indexes.length;
        if (len > 1) {
            for (uint256 i; i < len - 1; i++) {
                require(indexes[i] < indexes[i + 1], "need sorted indexes");
            }
        }
        uint256 locked;
        uint256 unlocked;
        address user = msg.sender;
        uint256 currentBlockNumber = block.number;
        for (uint256 i = len - 1; i >= 0; i--) {
            uint256 currentIndex = indexes[i];
            LockedFarmReward memory reward = _userLockedFarmRewards[user][currentIndex];
            if (currentBlockNumber - reward._blockNumber >= _farmPeriod) {
                unlocked += reward._locked;
            } else {
                uint256 cUnlocked = (reward._locked * (currentBlockNumber - reward._blockNumber)) / _farmPeriod;
                locked += reward._locked - cUnlocked;
                unlocked += cUnlocked;
            }
            LockedFarmReward[] storage sUser = _userLockedFarmRewards[user];
            sUser[currentIndex] = sUser[sUser.length - 1];
            sUser.pop();
        }
        _two.transfer(user, unlocked);
        _two.transfer(_treasury, locked);
        emit ClaimFarmReward(user, unlocked, locked);
    }

    function _claimFarmReward(uint256[] memory index) public noReentrant {
        require(index.length <= _userLockedFarmRewards[msg.sender].length, "Invalid index.");
        uint256[] memory orderIndex;
        orderIndex = new uint256[](index.length);
        orderIndex[0] = index[0];

        for (uint256 i; i < index.length; i++) {
            uint256 bonus = getClaimableFarmReward(msg.sender, index[i]);
            _two.transfer(msg.sender, bonus);
            _two.transfer(_treasury, (_userLockedFarmRewards[msg.sender][index[i]]._locked - bonus));
            if (i > 0) {
                uint256 j = i - 1;
                while (index[i] < orderIndex[j]) {
                    orderIndex[j + 1] = orderIndex[j];
                    j--;
                }
                orderIndex[j + 1] = index[i];
            }
        }
        for (uint256 i = orderIndex.length; i > 0; i--) {
            _userLockedFarmRewards[msg.sender][orderIndex[i - 1]] = _userLockedFarmRewards[msg.sender][
                _userLockedFarmRewards[msg.sender].length - 1
            ];
            _userLockedFarmRewards[msg.sender].pop();
        }
    }

    //******************************** view **********************************/
    function getFarmAccInfo(address account)
        public
        view
        override
        returns (LockedFarmReward[] memory lockedReward, uint256[] memory claimableReward)
    {
        lockedReward = _userLockedFarmRewards[account];
        claimableReward = new uint256[](lockedReward.length);
        for (uint256 i = 0; i < _userLockedFarmRewards[account].length; i++) {
            claimableReward[i] = getClaimableFarmReward(account, i);
        }
    }

    function getClaimableFarmReward(address account, uint256 index) public view override returns (uint256) {
        uint256 currentBlockNumber = block.number;
        uint256 unlockedAmount;
        LockedFarmReward[] memory user = _userLockedFarmRewards[account];
        if (index < user.length) {
            if (currentBlockNumber - user[index]._blockNumber < _farmPeriod) {
                unlockedAmount = (user[index]._locked * (currentBlockNumber - user[index]._blockNumber)) / _farmPeriod;
            } else unlockedAmount = user[index]._locked;
        }
        return unlockedAmount;
    }

    //**************************** admin function ****************************/
    function setFarmAdd(address newFarmAdd) public onlyOwner {
        require(newFarmAdd != address(0), "Invalid address.");
        _addFarm = newFarmAdd;
    }

    function setTwoToken(ITwoToken newToken) public onlyOwner {
        _two = newToken;
    }

    function setTreasury(address newTreasury) public onlyOwner {
        require(newTreasury != address(0), "Invalid address.");
        _treasury = newTreasury;
    }

    function setBlockNumber(uint256 newBlockNumber) public onlyOwner {
        _farmPeriod = newBlockNumber;
    }

    function version() public pure returns (uint256) {
        return 12;
    }
}

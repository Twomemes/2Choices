pragma solidity ^0.8.0;
import "../interfaces/IClaimLock.sol";
import "../interfaces/IKaki.sol";
import "../interfaces/IERC20.sol";
import "../base/WithAdminRole.sol";

contract ClaimLock is IClaimLock, WithAdminRole {
    IKaki  _kaki; 
    uint256 constant THOUSAND = 10 ** 3;
    uint256 public _startTime;
    uint256 public _tradingStartTime;
    uint256 public _farmPeriod;
    uint256 public _tradingPeriod;
    uint256 public _farmRate;
    address public _addFarm;
    address public _addTrading;
    
    bool internal locked;

    mapping(address => LockedFarmReward[]) public _userLockedFarmRewards;
    mapping(address => uint256) public _userFarmLockedAmount;

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

    function initialize(address farmAdd, IKaki kTokenAdd) public initializer {
        __WithAdminRole_init();
        // block number 
        _farmPeriod = 7776000;

        _addFarm = farmAdd;
        _kaki = kTokenAdd;
        _farmRate = 500;
    }

    function lockFarmReward(address account, uint256 amount) public override isFarm {
        uint256 currentBlockNumber = block.number;
        _userFarmLockedAmount[account] += amount;
        _userLockedFarmRewards[account].push(
            LockedFarmReward({
                    _locked: amount,
                    _blockNumber: currentBlockNumber
                })
        );
    }

    function claimFarmReward(uint256[] memory index) public override noReentrant {
        require(index.length <= _userLockedFarmRewards[msg.sender].length, "Invalid index.");
        for (uint256 i; i < index.length; i++) {
            uint256 bonus = getClaimableFarmReward(msg.sender, index[i]);
            _kaki.mint(msg.sender, bonus);
            _kaki.mint(_addTrading, (_userLockedFarmRewards[msg.sender][index[i]]._locked - bonus));
            _userLockedFarmRewards[msg.sender][index[i]] = _userLockedFarmRewards[msg.sender][_userLockedFarmRewards[msg.sender].length - 1];
            _userLockedFarmRewards[msg.sender].pop();
        }
    }

    //******************************** view **********************************/
    function getFarmAccInfo(address account) public override view returns (LockedFarmReward[] memory lockedReward, uint256[] memory claimableReward) {
        lockedReward = _userLockedFarmRewards[account];
        claimableReward = new uint256[](lockedReward.length);
        for(uint256 i = 0; i < _userLockedFarmRewards[account].length; i++) {
            claimableReward[i] = getClaimableFarmReward(account, i);
        }
    }
    
    function getClaimableFarmReward(address account, uint256 index) public override view returns (uint256) {
        uint256 currentBlockNumber = block.number;
        uint256 unlockedAmount;
        LockedFarmReward[] memory user = _userLockedFarmRewards[account];
        if(index < user.length) {
            if(currentBlockNumber - user[index]._blockNumber < _farmPeriod){
                uint256 claimableAmount = user[index]._locked * _farmRate / THOUSAND;
                unlockedAmount = claimableAmount + (user[index]._locked - claimableAmount) * (currentBlockNumber - user[index]._blockNumber) / _farmPeriod;
            }
            else unlockedAmount = user[index]._locked;
        }
        return unlockedAmount;
    }

    //**************************** admin function ****************************/
    function setFarmAdd(address newFarmAdd) public onlyOwner {
        require(newFarmAdd != address(0), "Invalid address.");
        _addFarm = newFarmAdd;
    }

    function version() public pure returns (uint256) {
        return 0;
    }

}
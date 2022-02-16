// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IGarden.sol";
import "../interfaces/IClaimLock.sol";

contract AdminLock is Ownable {
    IERC20 public _lp;
    IERC20 public _twoToken; 
    IClaimLock public _claimLock;
    IGarden public _farm;
    uint256 public constant LOCK_PERIOD = 14 weeks; //14 week
    address public constant initLpHolder=0xa86C5582404919822370EE2f2E3e247218054CC9;
    mapping(address => mapping(uint256 => uint256)) public _startTimestamp;
    mapping(address => mapping(uint256 => uint256)) public _depositList;

    constructor(IERC20 lp,IGarden farm,IERC20 two,IClaimLock claimLock) {
        _lp = lp;
        _farm = farm;
        _twoToken=two;
        _claimLock=claimLock;
    }

    receive() external payable {}

    function depositLP(uint256 amount) public {
        _lp.approve(address(_farm),amount);
        _lp.transferFrom(initLpHolder, address(this), amount);
        _farm.deposit(1, amount);
        _depositList[initLpHolder][1] += amount;
        _startTimestamp[initLpHolder][1] = block.timestamp;
    }

    function withdrawLP() public {
        require(block.timestamp >= _startTimestamp[initLpHolder][1] + LOCK_PERIOD, "STILL LOCKED.");

        uint256 amount = _depositList[initLpHolder][1];
        _farm.withdraw(1, amount);
        _lp.transfer(initLpHolder, _lp.balanceOf(address(this)));
        _twoToken.transfer(initLpHolder, _twoToken.balanceOf(address(this)));
        _depositList[initLpHolder][1] = 0;
    }

    function harvestAll() public {
        _farm.harvestAll();
    }

    function claim(uint256[] memory index) public {
        _claimLock.claimFarmReward(index);
    }

    function version() public pure returns (uint256) {
        return 1;
    }
}

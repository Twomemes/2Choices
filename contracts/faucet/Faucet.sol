pragma solidity ^0.8.0;

import "../base/WithAdminRole.sol";
import {IGarden} from "../interfaces/IGarden.sol";
import {IERC20} from "../interfaces/IERC20.sol";

contract Faucet is WithAdminRole {
    mapping(address => mapping(uint256 => uint256)) _facetTimes;
    IGarden public farm;
    IERC20 public token;
    uint256 public _facetLimit;
    uint256 public _facetValue;

    function initialize(IGarden farm_, IERC20 token_) public initializer {
        __WithAdminRole_init();
        _facetLimit = 3;
        _facetValue = 100 ether;
        token = token_;
        farm = farm_;
    }

    function facetBalance() public view returns (uint256 facetBalance, uint256 userBalance) {
        facetBalance = farm.pendingVirtualPoolReward(1);
        userBalance = token.balanceOf(msg.sender);
    }

    function faucet() public {
        require(_facetTimes[msg.sender][block.timestamp / 1 hours]++ < _facetLimit, "out of limit times this hour");
        farm.virtualPoolClaim(1, msg.sender);
    }

    function currentDayth() public view returns (uint256) {
        return block.timestamp / (24 * 3600);
    }

    function version() public pure returns (uint256) {
        return 3;
    }
}

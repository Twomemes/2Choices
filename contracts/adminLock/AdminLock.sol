// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IGarden.sol";

contract AdminLock is Ownable {
    IERC20 public _lp;
    IERC20 public _twoToken; 
    IGarden public _farm;
    uint256 public constant LOCK_PERIOD =3600;// 8467200; //14 week

    mapping(address => mapping(uint256 => uint256)) public _startTimestamp;
    mapping(address => mapping(uint256 => uint256)) public _depositList;

    constructor(IERC20 lp,IGarden farm,IERC20 two) {
        _lp = lp;
        _farm = farm;
        _twoToken=two;
    }

    receive() external payable {}

    function depositLP(uint256 amount, uint256 pid) public {
        _lp.transferFrom(msg.sender, address(this), amount);
        _farm.deposit(pid, amount);
        _depositList[msg.sender][pid] += amount;
        _startTimestamp[msg.sender][pid] = block.timestamp;
    }

    function withdrawLP(uint256 pid) public {
        require(block.timestamp >= _startTimestamp[msg.sender][pid] + LOCK_PERIOD, "STILL LOCKED.");

        uint256 amount = _depositList[msg.sender][pid];
        _farm.withdraw(pid, amount);
        _lp.transfer(msg.sender, amount);
        _twoToken.transfer(msg.sender, _twoToken.balanceOf(address(this)));
        _depositList[msg.sender][pid] = 0;
    }

    function version() public pure returns (uint256) {
        return 1;
    }
}

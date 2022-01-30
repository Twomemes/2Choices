// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IGarden.sol";

contract AdminLock is Ownable {
    uint256 public constant LOCK_PERIOD =3600;// 8467200; //14 week
    address public constant LP_ADDRESS = 0xd91cfd064F4C1a9ee91Fc58fCa671c4cF6A68ADB; //lp
    address public _farmAddress = 0xd91cfd064F4C1a9ee91Fc58fCa671c4cF6A68ADB; //farm
    address public _wftm = 0xd91cfd064F4C1a9ee91Fc58fCa671c4cF6A68ADB; //wftm
    address public _two = 0xd91cfd064F4C1a9ee91Fc58fCa671c4cF6A68ADB; //two
    address _admin;
    IERC20 public _lp;
    IERC20 public _twoToken;
    IGarden public _farm;
    mapping(address => mapping(uint256 => uint256)) public _startTimestamp;
    mapping(address => mapping(uint256 => uint256)) public _depositList;

    constructor() {
        _lp = IERC20(LP_ADDRESS);
        _farm = IGarden(_farmAddress);
    }

    receive() external payable {}

    function depositLP(uint256 amount, uint256 pid) public {
        _farm.deposit(pid, amount);
        _depositList[msg.sender][pid] += amount;
        _startTimestamp[msg.sender][pid] = block.timestamp;
    }

    function withdrawLP(uint256 pid) public {
        require(block.timestamp >= _startTimestamp[msg.sender][pid] + LOCK_PERIOD, "STILL LOCKED.");

        uint256 amount = _depositList[msg.sender][pid];
        _farm.withdraw(pid, amount);
        _lp.transfer(msg.sender, amount);
        _twoToken.transfer(msg.sender, IERC20(_two).balanceOf(address(this)));
        _depositList[msg.sender][pid] = 0;
    }
}

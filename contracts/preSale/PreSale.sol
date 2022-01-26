// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/Access/Ownable.sol";
contract PreSale is Ownable {
    uint256 public two_LeftAmount = 977777 ether;
    uint256 public constant LOWER_LIMIT = 10 ether;
    uint256 public constant SINGLETO_TWO = 1 ether;
    address public constant TWO_ADDRESS = 0xd91cfd064F4C1a9ee91Fc58fCa671c4cF6A68ADB;
    IERC20 public _two;

    constructor() {
        _two = IERC20(TWO_ADDRESS);
    }

    receive() external payable {}

    function sale() public payable {
        require(msg.value >= LOWER_LIMIT, "INVALID AMOUNT.");
        require(two_LeftAmount != 0, "SOLD OUT.");

        uint256 amount = SINGLETO_TWO *msg.value;
        if(amount >= two_LeftAmount) {
            _two.transfer(msg.sender, two_LeftAmount);
            uint256 backAmount = (amount - two_LeftAmount) / SINGLETO_TWO;
            (bool success, ) = msg.sender.call{ value: backAmount }(new bytes(0));
            require(success, "! safe transfer FTM");
        } else {
            _two.transfer(msg.sender, amount);
            two_LeftAmount -= amount;
        }
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = msg.sender.call{ value: amount }(new bytes(0));
        require(success, "! safe transfer FTM");
    }
}
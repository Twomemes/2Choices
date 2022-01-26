// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract PreSale is Ownable {
    uint256 public two_LeftPart = 4400;
    uint256 public constant LOWER_LIMIT = 22 * 1e18;
    uint256 public constant TWO_EACHPART = 22222 * 1e16;
    address public constant TWO_ADDRESS = 0xd91cfd064F4C1a9ee91Fc58fCa671c4cF6A68ADB;
    address _admin;
    IERC20 public _two;
    mapping(address => uint256) public saleList;

    constructor() {
        _two = IERC20(TWO_ADDRESS);
    }

    receive() external payable {}

    modifier onlyAdmin() {
        require(msg.sender == _admin, "Invalid address");
        _;
    }

    function sale() public payable {
        require(msg.value >= LOWER_LIMIT, "INVALID AMOUNT.");
        require(two_LeftPart != 0, "SOLD OUT.");
        uint256 part = (msg.value - msg.value % 22) / 22;
        require(saleList[msg.sender] + part < 10, "UPPER LIMIT");

        if (part > two_LeftPart) {
            uint256 amount = (part - two_LeftPart) * LOWER_LIMIT;
            (bool success, ) = msg.sender.call { value: amount } (new bytes(0));
            require(success, "! safe transfer FTM");
        } else {
            _two.transfer(msg.sender, part * TWO_EACHPART);
            two_LeftPart -= part;
            saleList[msg.sender] += part;
        }
        
    }

    function getLeftAmount() public view returns(uint256) {
        return two_LeftPart;
    }

    function withdraw() public onlyAdmin {
        uint256 amount = address(this).balance;
        (bool success, ) = msg.sender.call{ value: amount } (new bytes(0));
        require(success, "! safe transfer FTM");
    }

    function setAdmin(address newAdmin) public onlyOwner {
        require(newAdmin != address(0), "INVALID ADDRESS");
        _admin = newAdmin;
    }
}
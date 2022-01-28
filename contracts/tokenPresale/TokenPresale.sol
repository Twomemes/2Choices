// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../interfaces/ITokenPresale.sol";

contract TokenPresale is ITokenPresale, OwnableUpgradeable {
    uint256 public twoLeftPart ;
    uint256 public constant LOWER_LIMIT = 22 * 1e18;
    uint256 public constant TWO_EACHPART = 222222 * 1e15;
    uint256 public constant SALE_PERIOD = 86400;  //24h  86400
    uint256 public constant SALE_STARTSTAMP = 1643350647; //UTC 2022-2-3 10:00  1643882400
    address public constant TWO_ADDRESS = 0x7e09c5dE33C464394eaAa199Adc4b310A7ccBe6B;//0x9F1851f29374eFb292cFa78503fc02A9b640c45b
    address _admin;
    IERC20 public _two;
    mapping(address => uint256) public saleList;

    function initialize(IERC20 twoadd) public initializer {
        __Ownable_init();
        twoLeftPart = 200;
        _two = twoadd;
    }

    receive() external payable {}

    modifier onlyAdmin() {
        require(msg.sender == _admin, "Invalid address");
        _;
    }

    modifier isStart() {
        require(block.timestamp > SALE_STARTSTAMP && block.timestamp < SALE_STARTSTAMP + SALE_PERIOD, "END");
        _;
    }

    function sale() public payable override isStart {
        require(msg.value >= LOWER_LIMIT, "INVALID AMOUNT.");
        require(twoLeftPart != 0, "SOLD OUT.");
        uint256 part = msg.value  / 22 ether;
        require(saleList[msg.sender] + part <= 10, "UPPER LIMIT");

        if (part > twoLeftPart) {
            uint256 amount = (part - twoLeftPart) * LOWER_LIMIT;
            _two.transfer(msg.sender, twoLeftPart * TWO_EACHPART * 22);
            (bool success, ) = msg.sender.call { value: amount } (new bytes(0));
            require(success, "! safe transfer FTM");
        } else {
            _two.transfer(msg.sender, part * TWO_EACHPART * 22);
            twoLeftPart -= part;
            saleList[msg.sender] += part;
        }
        
    }

    function getLeftAmount() public view override returns(uint256) {
        return twoLeftPart;
    }

    function withdraw() public override onlyAdmin {
        uint256 amount = address(this).balance;
        (bool success, ) = msg.sender.call{ value: amount } (new bytes(0));
        require(success, "! safe transfer FTM");
    }

    function withdrawTwo() public override onlyAdmin {
        uint256 leftAmount = _two.balanceOf(address(this));
        if (leftAmount != 0) {
            _two.transfer(_admin, leftAmount);
        }
    }

    function setAdmin(address newAdmin) public onlyOwner {
        require(newAdmin != address(0), "INVALID ADDRESS");
        _admin = newAdmin;
    }

    function version() public pure returns (uint256) {
        return 5;
    }
}
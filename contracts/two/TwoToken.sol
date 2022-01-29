// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ITwoToken} from "../interfaces/ITwoToken.sol";

contract TwoToken is ERC20Permit, ITwoToken, Ownable {
    uint256 public constant MAX_SUPPLY = 222222000 ether;
    uint256 public constant PREMINT = 9777768 ether;
    address public constant AIRDROP = 0xa525bC8E6eeaB54b3e35cAaFa3C3Bc04228096eD;

    address public constant INITIAL_LIQUID = 0xc09fa50C69695E612b54829C158a63D52E62656B;

    address public constant INITIAL_TREASURY = 0x9b0057f98A95f3C7Fb7F8a8540ADF871F4DB14a1;
    address public constant AUCTION = 0xc09fa50C69695E612b54829C158a63D52E62656B;
    address public farmContract;
    bool public isSetFarm;

    // ------------------------------
    // protect the bots and whale on fair launch
    // ------------------------------
    uint256 public maxBuyAmount;
    bool public allowBuy;
    mapping(address => uint256) public lastBuy;
    uint256 public buyDelayBlock;

    event Mint(address indexed mintTo, address minter, uint256 amount);

    modifier onlyFarm() {
        require(msg.sender == farmContract, "only farm");
        _;
    }

    constructor() ERC20Permit("TWO") ERC20("2Choices", "TWO") {
        allowBuy = true;
        _mint(AIRDROP, PREMINT);
        _mint(AUCTION, PREMINT);
        _mint(INITIAL_LIQUID, PREMINT);
        _mint(INITIAL_TREASURY, PREMINT);
    }

    function mint(address to, uint256 amount) public override onlyFarm {
        require(totalSupply() + amount <= MAX_SUPPLY, "too much supply");
        _mint(to, amount);
        emit Mint(to, msg.sender, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(allowBuy, "not allow buy");
        address user = tx.origin;
        if (maxBuyAmount > 0) {
            require(amount <= maxBuyAmount, "exceeds maximum transfer");
        }
        if (buyDelayBlock > 0 && lastBuy[user] > 0) {
            require(lastBuy[user] + buyDelayBlock <= block.number, "delay block");
        }
        lastBuy[user] = block.number;
    }

    function burn(uint256 amount) public override {
        _burn(msg.sender, amount);
    }

    function setFarm(address newFarm) public onlyOwner {
        require(!isSetFarm, "Upper Limit");
        farmContract = newFarm;
        isSetFarm = true;
    }

    function setMaxBuyAmount(uint256 _maxBuyAmount) external onlyOwner {
        maxBuyAmount = _maxBuyAmount;
    }

    function setAllowBuy(bool _allowBuy) external onlyOwner {
        allowBuy = _allowBuy;
    }

    function setBuyDelayBlock(uint256 _buyDelayBlock) external onlyOwner {
        buyDelayBlock = _buyDelayBlock;
    }
}

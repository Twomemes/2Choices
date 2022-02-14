// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ITwoToken} from "../interfaces/ITwoToken.sol";

contract TwoToken is ERC20Permit, ITwoToken, Ownable {
    uint256 public constant MAX_SUPPLY = 222222000 ether;
    uint256 public constant PREMINT = 9777768 * 1e17;
    address public constant AIRDROP = 0xcBe6952d500E892Ed403894a8Dd06134daE9BD81;

    address public constant INITIAL_LIQUID = 0xa86C5582404919822370EE2f2E3e247218054CC9;

    address public constant INITIAL_TREASURY = 0xAc20A0B1eb8604C35b97ded69d7A1E4F96Ed57c1;
    address public constant AUCTION = 0xa86C5582404919822370EE2f2E3e247218054CC9;
    address public constant INIT_LP_OPERATOR = 0xa86C5582404919822370EE2f2E3e247218054CC9;
    address public farmContract;
    address public swapAddress;
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
        allowBuy = false;
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
        address user = tx.origin;
        if (user != INIT_LP_OPERATOR) {
            require(allowBuy, "not allow buy");
        }
        if (from == swapAddress || to == swapAddress) {
            if (maxBuyAmount > 0) {
                require(amount <= maxBuyAmount, "exceeds maximum transfer");
            }
            if (buyDelayBlock > 0 && lastBuy[user] > 0) {
                require(block.number - lastBuy[user] > buyDelayBlock, "delay block");
            }
            lastBuy[user] = block.number;
        }
    }

    function burn(uint256 amount) public override {
        _burn(msg.sender, amount);
    }

    function batchTransferFrom(
        address from,
        address[] memory recepinents,
        uint256[] memory amounts
    ) public override {
        uint256 len = recepinents.length;
        require(len == amounts.length, "length not match");
        for (uint256 i; i < len; i++) {
            transferFrom(from, recepinents[i], amounts[i]);
        }
    }

    function batchTransfer(address[] memory recepinents, uint256[] memory amounts) public override {
        uint256 len = recepinents.length;
        require(len == amounts.length, "length not match");
        for (uint256 i; i < len; i++) {
            transfer(recepinents[i], amounts[i]);
        }
    }

    function setFarm(address newFarm) public onlyOwner {
        require(!isSetFarm, "Upper Limit");
        farmContract = newFarm;
        isSetFarm = true;
    }

    function setMaxBuyAmount(uint256 _maxBuyAmount) public onlyOwner {
        maxBuyAmount = _maxBuyAmount;
    }

    function setAllowBuy(bool _allowBuy) public onlyOwner {
        allowBuy = _allowBuy;
    }

    function setBuyDelayBlock(uint256 _buyDelayBlock) public onlyOwner {
        buyDelayBlock = _buyDelayBlock;
    }

    function setSwapAddress(address _swapAddress) public onlyOwner {
        swapAddress = _swapAddress;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {ITwoToken} from "../interfaces/ITwoToken.sol";

contract TwoToken is ERC20Permit, ITwoToken, Ownable {
    bytes32 public constant MINTER = keccak256("MINTER");
    //uint256 public constant MAX_SUPPLY = 222222222_222222222222222222;
    uint256 public constant MAX_SUPPLY = 222222000 * 1e18;
    uint256 public constant PREMINT = 977777 * 1e18;
    address public constant AIRDROP = 0xa525bC8E6eeaB54b3e35cAaFa3C3Bc04228096eD;

    address public constant INITIAL_LIQUID = 0xa525bC8E6eeaB54b3e35cAaFa3C3Bc04228096eD;

    address public constant INITIAL_TREASURY = 0x9b0057f98A95f3C7Fb7F8a8540ADF871F4DB14a1;
    address public constant AUCTION = 0xc09fa50C69695E612b54829C158a63D52E62656B;
    address public _farm;
    bool public isSetFarm;

    event Mint(address indexed mintTo, address minter, uint256 amount);

    modifier onlyFarm() {
        require(msg.sender == _farm, "Invalid address");
        _;
    }

    constructor() ERC20Permit("TWO") ERC20("2Choices", "TWO") {
        _mint(AIRDROP, PREMINT);
        _mint(AUCTION, PREMINT);
        _mint(INITIAL_LIQUID, PREMINT);
        _mint(INITIAL_TREASURY, PREMINT);
    }

    function mint(address to, uint256 amount) public override onlyFarm{
        require(totalSupply() + amount <= MAX_SUPPLY, "too much supply");
        _mint(to, amount);
        emit Mint(to, msg.sender, amount);
    }


    function burn(uint256 amount) public override  {
        _burn(msg.sender, amount);
    }

    function setFarm(address newFarm) public onlyOwner {
        require(!isSetFarm, "Upper Limit");
        _farm = newFarm;
        isSetFarm = !isSetFarm;
    }
}

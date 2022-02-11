// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../base/WithRandom.sol";
import "../base/WithAdminRole.sol";
import "../interfaces/IKakiTicket.sol";
import "../interfaces/IKakiCaptain.sol";
import "../interfaces/IBlindBox.sol";

contract BlindBox is WithAdminRole, IBlindBox, WithRandom {

    IERC20 _two;
    IKakiTicket _kakiTicket;
    IKakiCaptain _kakiCaptain;

    string[] _uri;
    bool _able;
    uint256 constant THOUSAND = 10 ** 3;
    uint256 public _lowPrice;
    uint256 public _highPrice;
    uint256 public _ticketPrice;
    uint256 public _sTicketProb;
    uint256 public _rPr;
    uint256 public _srPr;
    uint256 public _commonChip;
    uint256 public _rareChip;
    uint256 public _foundationRate;
    address public _squidGameAdd;
    address public _foundation;
    address public _squidCoinBase;
    address public _feeFound;
    address constant BlackHole = 0x0000000000000000000000000000000000000000;
    mapping(uint256 => uint256) _sTicketCount;

    function initialize(
        IKakiTicket ercAdd,
        IERC20 kTokenAdd,
        IRandoms radomAdd
    ) public initializer {
        __WithAdminRole_init();
        __WithRandom_init(radomAdd);
        _two = kTokenAdd;
        _kakiTicket = ercAdd;
        _lowPrice = 160 ether;
        _highPrice = 320 ether;
        _ticketPrice = 222 ether;
        _commonChip = 16;
        _rareChip = 32;
        _sTicketProb = 49;
        _rPr = 85;
        _srPr = 99;
        _foundationRate = 20; //2%
        _foundation = 0xAc20A0B1eb8604C35b97ded69d7A1E4F96Ed57c1; // kaki foundation address
        _feeFound = 0xD4b887b40393Ab960138EA1cD7Fb49EBE221d7A0;//
        _squidCoinBase = 0x73a0aA76D57CFd77a840DC18CE2C469C5610D993;
    }

    modifier isAble() {
        require(!_able, "Lock is enabled.");
        _;
    }

    modifier onlyNoneContract() {
        require(msg.sender == tx.origin, "only non contract call");
        _;
    }

    function aBoxOpen(uint256 num) public override isAble {
        for (uint256 i; i < num; i++) {
            _aBoxOpen();
        }
    }

    function bBoxOpen(uint256 num) public override isAble {
        _two.transferFrom(msg.sender, _foundation, num * _ticketPrice);
        for (uint256 i; i < num; i ++) {
            _bBoxOpen();
        }
    }

    function _aBoxOpen() internal {
        _two.transferFrom(msg.sender, _squidCoinBase, _lowPrice);
        uint256 rand = random(5, 15);
        _kakiTicket.mint(msg.sender, _commonChip, rand, _lowPrice, 0);
        emit BuyABox(msg.sender, 0);
    }

    function _bBoxOpen() internal {
        uint256 randTicket = random(1, 100);
        uint256 rand = random(0, 10);

        if (randTicket <= _rPr) {
            _kakiTicket.mint(msg.sender, _commonChip, rand + 5, _lowPrice, 0);

            uint256 fee = _lowPrice * _foundationRate / THOUSAND;
            _two.transferFrom(_foundation, _feeFound, fee);
            _two.transferFrom(_foundation, _squidCoinBase, _lowPrice - fee);
            emit BuyBBox(msg.sender, 0);

        } else if (randTicket <= _srPr) {
            _kakiTicket.mint(msg.sender, _rareChip, rand + 10, _highPrice, 1);

            uint256 fee = _highPrice * _foundationRate / THOUSAND;
            _two.transferFrom(_foundation, _feeFound, fee);
            _two.transferFrom(_foundation, _squidCoinBase, _highPrice - fee);
            emit BuyBBox(msg.sender, 1);
            
        } else {
            _kakiTicket.mint(msg.sender, _rareChip, _sTicketProb, _highPrice, 2);

            uint256 fee = _highPrice * _foundationRate / THOUSAND;
            _two.transferFrom(_foundation, _feeFound, fee);
            _two.transferFrom(_foundation, _squidCoinBase, _highPrice - fee);

            emit BuyBBox(msg.sender, 2); 
        }
    }

    function getRand() public view returns (uint256) {
        uint256 a = random(1, 100);
        return a;
    }

    function getrPr() public view returns (uint256) {
        return _rPr;
    }

    //****************************** admin function ***************************************** */
    function setSTicketProb(uint256 newProb) public onlyOwner {
        _sTicketProb = newProb;
    }

    function setABoxPrice(uint256 aPrice) public onlyOwner {
        _lowPrice = aPrice;
    }

    function setBBoxPrice(uint256 ticketPrice) public onlyOwner {
        _ticketPrice = ticketPrice;
    }

    function setRPr(uint256 newRPr) public onlyOwner {
        _rPr = newRPr;
    }

    function setERC721(address ercAdd) public onlyOwner {
        _kakiTicket = IKakiTicket(ercAdd);
    }

    function setFeeFound(address newFeeFound) public onlyOwner {
        require(newFeeFound != BlackHole, "Invalid address");
        _feeFound = newFeeFound;
    }

    function setFound(address newFound) public onlyOwner {
        require(newFound != BlackHole, "Invalid address");
        _foundation = newFound;
    }

    function setTWO(IERC20 newTwo) public onlyOwner {
        _two = newTwo;
    }

    function setSquidCoinBaseAdd(address newSquidCoinBaseAdd) public onlyOwner {
        require(newSquidCoinBaseAdd != BlackHole, "Invalid address");
        _squidCoinBase = newSquidCoinBaseAdd;
    }

    function setAble() public onlyOwner {
        _able = !_able;
    }

    function version() public pure returns (uint256) {
        return 8;
    }
}

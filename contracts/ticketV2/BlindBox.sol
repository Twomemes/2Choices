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
    uint256 _startTime;
    uint256 constant THOUSAND = 10 ** 3;
    uint256 public _lowPrice;
    uint256 public _highPrice;
    uint256 public _ticketPrice;
    uint256 public _sTicketProb;
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
        _startTime = 7776000;   //start time set before deploy!
        _lowPrice = 160 ether;
        _highPrice = 320 ether;
        _ticketPrice = 222 ether;
        _commonChip = 16;
        _rareChip = 32;
        _sTicketProb = 49;
        _foundationRate = 20; //2%
        _foundation = 0x958f0991D0e847C06dDCFe1ecAd50ACADE6D461d; // kaki foundation address
        _feeFound = 0x958f0991D0e847C06dDCFe1ecAd50ACADE6D461d;//
        _squidCoinBase = 0x958f0991D0e847C06dDCFe1ecAd50ACADE6D461d;
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

        if (randTicket <= 85) {
            _kakiTicket.mint(msg.sender, _commonChip, rand + 5, _lowPrice, 0);

            uint256 fee = _lowPrice * _foundationRate / THOUSAND;
            _two.transferFrom(_foundation, _feeFound, fee);
            _two.transferFrom(_foundation, _squidCoinBase, _lowPrice - fee);
            emit BuyBBox(msg.sender, 0);

        } else if (randTicket <= 99) {
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

    function setERC721(address ercAdd) public onlyOwner {
        _kakiTicket = IKakiTicket(ercAdd);
    }

    function setFeeFound(address newFeeFound) public onlyOwner {
        require(newFeeFound != BlackHole, "Invalid address");
        _feeFound = newFeeFound;
    }

    function setSquidCoinBaseAdd(address newSquidCoinBaseAdd) public onlyOwner {
        require(newSquidCoinBaseAdd != BlackHole, "Invalid address");
        _squidCoinBase = newSquidCoinBaseAdd;
    }

    function setAble() public onlyOwner {
        _able = !_able;
    }

    function version() public pure returns (uint256) {
        return 1;
    }
}

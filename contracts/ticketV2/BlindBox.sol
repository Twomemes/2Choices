// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../base/WithRandom.sol";
import "../base/WithAdminRole.sol";
import "../interfaces/IKakiTicket.sol";
import "../interfaces/IKakiCaptain.sol";
import "../interfaces/IBlindBox.sol";

contract BlindBox is WithAdminRole, IBlindBox, WithRandom {

    IERC20 _kaki;
    IKakiTicket _kakiTicket;
    IKakiCaptain _kakiCaptain;

    string[] _uri;
    bool _able;
    uint256 _startTime;
    uint256 constant THOUSAND = 10 ** 3;
    uint256 public _aPrice;
    uint256 public _bPrice;
    uint256 public _sTicketProb;
    uint256 public _commonChip;
    uint256 public _rareChip;
    uint256 public _foundationRate;
    address public _squidGameAdd;
    address public _foundation;
    address public _squidCoinBase;
    address public _squidGameFound;
    address constant BlackHole = 0x0000000000000000000000000000000000000000;
    mapping(uint256 => uint256) _sTicketCount;

    function initialize(IKakiTicket ercAdd, IERC20 kTokenAdd, IRandoms radomAdd) public initializer {
        __WithAdminRole_init();
        __WithRandom_init(radomAdd);
        _kaki = kTokenAdd;
        _kakiTicket = ercAdd;
        _startTime = 7776000;   //start time set before deploy!
        _aPrice = 100 ether;
        _bPrice = 222 ether;
        _commonChip = 16;
        _rareChip = 32;
        _sTicketProb = 49;
        _foundationRate = 20; //2%
        _foundation = 0x958f0991D0e847C06dDCFe1ecAd50ACADE6D461d; // kaki foundation address
        _squidGameFound = 0x958f0991D0e847C06dDCFe1ecAd50ACADE6D461d;//
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
        for (uint256 i; i < num; i ++) {
            _aBoxOpen();
        }
    }

    function bBoxOpen(uint256 num) public override isAble {
        for (uint256 i; i < num; i ++) {
            _bBoxOpen();
        }
    }

    // function combine(uint256[3] memory ticket, uint256[] memory extraCap) public override isAble onlyNoneContract {
    //     require(extraCap.length <= 3, "Invalid number of captain.");

    //     uint256 totalChip;
    //     uint256 totalType;
    //     uint256 totalProb;

    //     for(uint256 i; i < 3; i ++) {
    //         require(_kakiTicket.ownerOf(ticket[i]) == msg.sender, "Not NFT owner.");
    //         totalChip += _kakiTicket.getTicketInfo(ticket[i]).chip;
    //         totalType += _kakiTicket.getTicketInfo(ticket[i]).ticketType;
    //         totalProb += _kakiTicket.getTicketInfo(ticket[i]).prob;
    //     }

    //     uint256 extraProb;

    //     for(uint256 i; i < extraCap.length; i ++) {
    //         require(_kakiCaptain.ownerOf(extraCap[i]) == msg.sender, "Not NFT owner.");
    //         extraProb += _kakiCaptain.getCapInfo(extraCap[i]).combineRate;
    //     }

    //     require(totalType == 3 && totalChip == 80, "Invalid NFT.");
    //     uint256 rand = random(1, 100);
    //     totalProb = totalProb + extraProb;
        
    //     for (uint256 i; i < 3; i++){
    //         _kakiTicket.transferFrom(msg.sender, address(0xdead), ticket[i]);
    //     }

    //     if (rand <= totalProb) {
    //         _kakiTicket.mint(msg.sender, _commonChip, 0, 0, 3);
    //     }
    // }

    function _aBoxOpen() internal {
        _kaki.transferFrom(msg.sender, _squidCoinBase, _aPrice);
        uint256 rand = random(5, 15);
        _kakiTicket.mint(msg.sender, _commonChip, rand, _aPrice, 0);
        emit BuyABox(msg.sender, 0);
    }

    function _bBoxOpen() internal {
        uint256 fee = _bPrice * _foundationRate / THOUSAND;
        _kaki.transferFrom(msg.sender, _foundation, fee);
        _kaki.transferFrom(msg.sender, _squidCoinBase, _bPrice - fee);
        uint256 randTicket = random(1, 100);
        uint256 rand = random(0, 10);
 
        if (randTicket <= 85) {
            _kakiTicket.mint(msg.sender, _commonChip, rand + 5, _aPrice, 0);
            emit BuyBBox(msg.sender, 0);
        } else if (randTicket <= 99) {
            _kakiTicket.mint(msg.sender, _rareChip, rand + 10, _bPrice, 1);
            emit BuyBBox(msg.sender, 1);
        } else {
            _kakiTicket.mint(msg.sender, _rareChip, _sTicketProb, _bPrice, 2);
            emit BuyBBox(msg.sender, 2); 
        }
    }

    //****************************** admin function ***************************************** */
    function setSTicketProb(uint256 newProb) public onlyOwner {
        _sTicketProb = newProb;
    }
    
    function setABoxPrice(uint256 aPrice) public onlyOwner {
        _aPrice = aPrice;
    }

    function setBBoxPrice(uint256 bPrice) public onlyOwner {
        _bPrice = bPrice;
    }

    function setERC721(address ercAdd) public onlyOwner {
        _kakiTicket = IKakiTicket(ercAdd);
    }

    function setSquidFoundAdd(address newSquidFoundAdd) public onlyOwner {
        require(newSquidFoundAdd != BlackHole, "Invalid address");
        _squidGameFound = newSquidFoundAdd;
    }

    function setSquidCoinBaseAdd(address newSquidCoinBaseAdd) public onlyOwner {
        require(newSquidCoinBaseAdd != BlackHole, "Invalid address");
        _squidCoinBase = newSquidCoinBaseAdd;
    }

    function setAble() public onlyOwner {
        _able = !_able;
    }

    function version() public pure returns (uint256) {
        return 0;
    }
}

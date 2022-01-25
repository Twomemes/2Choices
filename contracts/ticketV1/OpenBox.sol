// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./interface/ITicket.sol";
import "./interface/IOpenBox.sol";
import "../base/WithRandom.sol";
import "../base/BaseERC721.sol";
import "../base/WithAdminRole.sol";
import "../interfaces/IAddressList.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OpenBox is IOpenBox, WithRandom, WithAdminRole {
    mapping(address => bool) public _claim;
    mapping(address => uint256) public _claimTimeLimit;

    IERC20 public _busd;
    ITicket public _ticket;
    IAddressList public _addressList;

    string[] _uri;
    bool _able;
    bool _claimAble;
    uint256 _count;
    //uint256 constant BASE = 10**18;
    uint256 public _ticketPrice;
    uint256 public _claimLimit;
    uint256 public _invalidTime;
    uint256 public _foundationRate;
    address public _kakiFoundation;
    address public _squidCoinBase;
    address public _squidGameFound;
    address constant BlackHole = 0x0000000000000000000000000000000000000000;

    function initialize(
        ITicket ercAdd,
        IERC20 busdAdd,
        uint256 invalidTime,
        IAddressList allowList
    ) public initializer {
        __WithAdminRole_init();
        _ticket = ercAdd;
        _busd = busdAdd;
        _addressList = allowList;
        _ticketPrice = 10;
        _claimLimit = 1;
        _foundationRate = 0;
        _invalidTime = invalidTime;
        _kakiFoundation = 0x958f0991D0e847C06dDCFe1ecAd50ACADE6D461d; // kaki foundation address
        _squidGameFound = 0xF6ee79720964bE662D6653fa60b7D356D8a61e59; //
        _squidCoinBase = 0x580377aA000B374785122a8cbe6033120461552d;
    }

    modifier isAble() {
        require(!_able, "Lock is enabled.");
        _;
    }

    modifier isClaimOver() {
        require(!_claimAble, "Claim had ended.");
        _;
    }

    function claim() public override isClaimOver {
        require(_addressList.isInAddressList(msg.sender), "Not allow.");
        require(_claimTimeLimit[msg.sender] < _claimLimit, "Claim too much.");
        _ticket.mint(msg.sender, true, _invalidTime, _ticketPrice, _ticketPrice);
        _busd.transferFrom(_squidCoinBase, _squidGameFound, _ticketPrice);
        _claimTimeLimit[msg.sender]++;
        emit Claim(msg.sender);
    }

    function buyTicket(uint256 num) public override isAble {
        require(num > 0, "Invalid num.");
        require(_busd.balanceOf(msg.sender) >= _ticketPrice * num, "Do not have enough BUSD.");
        _busd.transferFrom(msg.sender, _squidGameFound, _ticketPrice * num);
        for (uint256 i; i < num; i++) {
            _ticket.mint(msg.sender, false, 0, _ticketPrice, _ticketPrice);
        }
        emit BuyTicket(msg.sender, num);
    }

    //****************************** admin function ***************************************** */
    function setTicketPrice(uint256 ticketPrice) public onlyOwner {
        _ticketPrice = ticketPrice;
    }

    function setERC721(address ercAdd) public onlyOwner {
        _ticket = ITicket(ercAdd);
    }

    function setInvalidTime(uint256 newInvalidTime) public onlyOwner {
        _invalidTime = newInvalidTime;
    }

    function setClaimWhiteList(IAddressList allowList) public onlyOwner {
        _addressList = allowList;
    }

    function setClaimAble() public onlyOwner {
        _claimAble = !_claimAble;
    }

    function setAble() public onlyOwner {
        _able = !_able;
    }

    function setClaimLimit(uint256 newClaimLimit) public onlyOwner {
        require(newClaimLimit > 0, "Invalid limit number");
        _claimLimit = newClaimLimit;
    }

    function clearClaimLimit(address[] memory accountList) public onlyOwner {
        for (uint256 i; i < accountList.length; i++) {
            if (_claimTimeLimit[accountList[i]] == 1) {
                _claimTimeLimit[accountList[i]]--;
            }
        }
    }

    function setFoundAdd(address newFoundAdd) public onlyOwner {
        require(newFoundAdd != BlackHole, "Invalid  address");
        _kakiFoundation = newFoundAdd;
    }

    function setSquidFoundAdd(address newSquidFoundAdd) public onlyOwner {
        require(newSquidFoundAdd != BlackHole, "Invalid  address");
        _squidGameFound = newSquidFoundAdd;
    }

    function setSquidCoinBaseAdd(address newSquidCoinBaseAdd) public onlyOwner {
        require(newSquidCoinBaseAdd != BlackHole, "Invalid  address");
        _squidCoinBase = newSquidCoinBaseAdd;
    }

    //***************************************** read   ***************************************** */

    function getClaimLimit(address account) public view override returns (uint256 claimLimit) {
        return _claimTimeLimit[account];
    }

    function version() public pure returns (uint256) {
        return 10;
    }
}

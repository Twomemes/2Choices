// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "../interfaces/ITokenPresale.sol";

contract TokenPresale is ITokenPresale, OwnableUpgradeable {
    using ECDSAUpgradeable for bytes32;

    uint256 public _twoLeftPart;
    uint256 public _saleStartStamp ; //UTC 2022-2-3 10:00  1643882400
    uint256 public _salePeriod;  //24h  86400
    uint256 public _wlSalePeriod;
    uint256 public _claimPeriod;
    uint256 public constant SINGLEPART = 11 * 1e18;
    uint256 public constant TWO_EACHPART = 2222.22 * 1e18;
    address public _admin;
    address public _signer;
    IERC20 public _two;
    mapping(address => uint256) public override saleList;
    mapping(address => bool) public override claimList;

    function initialize(IERC20 twoadd, address signerAdd) public initializer {
        __Ownable_init();
        _twoLeftPart = 440;
        _two = twoadd;
        _saleStartStamp = 1644398100;
        _salePeriod = 2400;  //60 * 20 * 3
        _wlSalePeriod = 1200;
        _claimPeriod = 3600;
        _signer = signerAdd;
    }

    receive() external payable {}

    modifier onlyAdmin() {
        require(msg.sender == _admin, "Invalid address");
        _;
    }

    modifier isNoneWLStart() {
        require(block.timestamp > _saleStartStamp + _wlSalePeriod && block.timestamp < _saleStartStamp + _salePeriod, "SALE HAD END.");
        _;
    }

    function sale() public payable override isNoneWLStart {
        require(_twoLeftPart != 0, "SOLD OUT.");
        require(msg.value == SINGLEPART, "INVALID AMOUNT.");
        require(saleList[msg.sender] == 0, "HAD BOUGHT.");
        _twoLeftPart -= 1;
        saleList[msg.sender] = 1;

        emit Sale(msg.sender);
    }

    function whiteListSale(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public payable override{
        require(_twoLeftPart > 0, "SOLD OUT.");
        uint256 currentTime = block.timestamp;
        require(currentTime > _saleStartStamp && currentTime < _saleStartStamp + _wlSalePeriod, "WHITELIST SALE END OR NOT START.");
        require(saleList[msg.sender] == 0, "HAD BOUGHT.");
        require(msg.value == SINGLEPART, "INVALID AMOUNT.");
        require(
            keccak256(abi.encodePacked(msg.sender)).toEthSignedMessageHash().recover(v, r, s) == _signer,
            "INVALID SIGNATURE."
        );
        _twoLeftPart -= 1;
        saleList[msg.sender] = 1;

        emit WhiteListSale(msg.sender);
    }

    function claim() public override {
        uint256 currentTime = block.timestamp;
        require(currentTime > _saleStartStamp + _claimPeriod, "NOT START");
        require(saleList[msg.sender] == 1, "CAN NOT CLAIM");
        require(!claimList[msg.sender], "HAD CLAIMED");

        _two.transfer(msg.sender, TWO_EACHPART);
        claimList[msg.sender] = true;
    }

    //===================================================VIEW======================================= */

    function getLeftAmount() public view override returns(uint256) {
        return _twoLeftPart;
    }
 
    function checkCurrentPeriod() public view override returns(uint256 wlStart, uint256 wlEnd, uint256 saleEnd, uint256 claimTime) {
        wlStart = _saleStartStamp;
        wlEnd = _saleStartStamp + _wlSalePeriod;
        saleEnd = _saleStartStamp + _salePeriod;
        claimTime = _saleStartStamp + _claimPeriod;
    }


    //===================================================ADMIN======================================= */
    function withdraw() public onlyAdmin {
        require(_admin != address(0), "INVALID ADMIN.");

        uint256 amount = address(this).balance;
        (bool success, ) = msg.sender.call{ value: amount } (new bytes(0));
        require(success, "! safe transfer FTM");
    }

    function withdrawTwo() public onlyAdmin {
        require(_admin != address(0), "INVALID ADMIN.");
        
        uint256 leftAmount = _two.balanceOf(address(this));
        if (leftAmount != 0) {
            _two.transfer(_admin, leftAmount);
        }
    }

    function setSaleStartStamp(uint256 newStart) public onlyOwner {    
        _saleStartStamp = newStart;
    }

    function setSalePeriod(uint256 newPeriod) public onlyOwner {    
        _salePeriod = newPeriod;
    }

    function setWLSalePeriod(uint256 newPeriod) public onlyOwner {    
        _wlSalePeriod = newPeriod;
    }

    function setAdmin(address newAdmin) public onlyOwner {
        require(newAdmin != address(0), "INVALID ADDRESS");
        _admin = newAdmin;
    }

    function setSigner(address signer) public onlyOwner {
        _signer = signer;
    }

    function version() public pure returns (uint256) {
        return 4;
    }
}
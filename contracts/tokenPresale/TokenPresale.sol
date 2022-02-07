// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "../interfaces/ITokenPresale.sol";

contract TokenPresale is ITokenPresale, OwnableUpgradeable {
    using ECDSAUpgradeable for bytes32;

    uint256 public twoLeftPart;
    uint256 public saleStartStamp ; //UTC 2022-2-3 10:00  1643882400
    uint256 public salePeriod;  //24h  86400
    uint256 public wlSalePeriod;
    uint256 public constant SINGLEPART = 11 * 1e18;
    uint256 public constant TWO_EACHPART = 2222.22 * 1e18;
    address public _admin;
    address public _signer;
    IERC20 public _two;
    mapping(address => uint256) public saleList;    

    function initialize(IERC20 twoadd) public initializer {
        __Ownable_init();
        twoLeftPart = 440;
        _two = twoadd;
        saleStartStamp = 1644224400;
        salePeriod = 2400;  //60 * 20 * 3
        wlSalePeriod = 1200;
    }

    receive() external payable {}

    modifier onlyAdmin() {
        require(msg.sender == _admin, "Invalid address");
        _;
    }

    modifier isNoneWLStart() {
        require(block.timestamp > saleStartStamp + wlSalePeriod && block.timestamp < saleStartStamp + salePeriod, "SALE HAD END.");
        _;
    }

    function sale() public payable override isNoneWLStart {
        require(twoLeftPart != 0, "SOLD OUT.");
        require(msg.value == SINGLEPART, "INVALID AMOUNT.");
        require(saleList[msg.sender] == 0, "HAD BOUGHT.");
        _sale(msg.sender);

        emit Sale(msg.sender);
    }

    function whiteListSale(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public payable override{
        uint256 currentTime = block.timestamp;
        require(currentTime > saleStartStamp && currentTime < saleStartStamp + wlSalePeriod, "WHITELIST SALE END OR NOT START.");
        require(saleList[msg.sender] == 0, "HAD BOUGHT.");
        require(msg.value == SINGLEPART, "INVALID AMOUNT.");
        require(
            keccak256(abi.encode(msg.sender)).toEthSignedMessageHash().recover(v, r, s) == _signer,
            "claim:Invalid signarure"
        );
        _sale(msg.sender);

        emit Sale(msg.sender);
    }

    //===================================================VIEW======================================= */

    function getLeftAmount() public view override returns(uint256) {
        return twoLeftPart;
    }
 
    function checkCurrentPeriod() public view override returns(uint256) {
        uint256 currentTime = block.timestamp;
        if (currentTime > saleStartStamp && currentTime < saleStartStamp + wlSalePeriod) return 1; 
        else return 2;
    }

    //===================================================INTERNAL======================================= */
    function _sale(address receiver) internal {
        _two.transfer(receiver, TWO_EACHPART);
        twoLeftPart -= 1;
        saleList[receiver] += 1;
    }

    //===================================================ADMIN======================================= */
    function withdraw() public override onlyAdmin {
        require(_admin != address(0), "INVALID admin");

        uint256 amount = address(this).balance;
        (bool success, ) = msg.sender.call{ value: amount } (new bytes(0));
        require(success, "! safe transfer FTM");
    }

    function withdrawTwo() public override onlyAdmin {
        require(_admin != address(0), "INVALID admin");
        
        uint256 leftAmount = _two.balanceOf(address(this));
        if (leftAmount != 0) {
            _two.transfer(_admin, leftAmount);
        }
    }

    function setSaleStartStamp(uint256 newStart) public onlyOwner {    
        saleStartStamp = newStart;
    }

    function setSalePeriod(uint256 newPeriod) public onlyOwner {    
        salePeriod = newPeriod;
    }

    function setAdmin(address newAdmin) public onlyOwner {
        require(newAdmin != address(0), "INVALID ADDRESS");
        _admin = newAdmin;
    }

    function version() public pure returns (uint256) {
        return 0;
    }
}
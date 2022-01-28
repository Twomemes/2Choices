// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Airdrop is OwnableUpgradeable {
    using ECDSAUpgradeable for bytes32;

    event Claim(address indexed account, uint256 amount);

    address public _signer;
    uint256 public _remain;
    IERC20 _two;
    mapping(address => uint256) public _claimList;


    function initialize(address signer) public initializer {
        __Ownable_init();
        _signer = signer;
        _remain = 1000;
    }

    function claim(
        uint256 amount,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        require(_claimList[msg.sender] == 0, "HAD CLAIMED");
        require(_remain != 0, "OVER");
        require(
            keccak256(abi.encodePacked(msg.sender, amount)).toEthSignedMessageHash().recover(v, r, s) == _signer,
            "claim:Invalid signarure"
        );
        _two.transfer(msg.sender, amount);
        _claimList[msg.sender] = amount;
        _remain -= 1;
        emit Claim(msg.sender, amount);
    }

    function setSigner(address signer) public onlyOwner {
        _signer = signer;
    }

    function setTwo(IERC20 twoAddress) public onlyOwner {
        _two = twoAddress;
    function airDropEnd(address airdropAdress) public onlyOwner {
        _two.transfer(airdropAdress, _two.balanceOf(address(this)));
    }

    function version() public pure returns (uint256) {
        return 5;
    }
}
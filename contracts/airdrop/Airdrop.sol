// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Airdrop is OwnableUpgradeable {
    address public _signer;
    IERC20 _two;
    mapping(address => uint256) public _claimList;

    event Claim(address indexed account, uint256 amount);

    function initialize() public initializer {}

    function claim(
        uint256 amount,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        require(_claimList[msg.sender] == 0, "HAD CLAIMED");
        bytes32 hash = keccak256(abi.encode(msg.sender,amount));
        bytes32 signature = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
        address signer = ecrecover(signature, v, r, s);

        require(signer == _signer, "INVALID SIGNATURE");
        _two.transfer(msg.sender, amount);
        _claimList[msg.sender] = amount;
        emit Claim(msg.sender, amount);
    }

    function setSigner(address signer) public onlyOwner {
        _signer = signer;
    }

    function version() public pure returns (uint256) {
        return 1;
    }
}
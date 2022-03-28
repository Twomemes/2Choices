// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../interfaces/IGarden.sol";

contract ClaimAble is OwnableUpgradeable {
    using ECDSAUpgradeable for bytes32;

    event LogClaim(uint256 indexed id, address indexed account, uint256 amount);

    uint256 public limitedOnce;
    address public signer;
    IGarden public garden;
    IERC20 public two;
    mapping(uint256 => mapping(address => uint256)) public claimRecord;
    mapping(uint256 => uint256) public claimed;

    struct Claim {
        uint256 id;
        uint256 amount;
        bytes32 r;
        bytes32 s;
        uint8 v;
    }

    modifier onlyHuman() {
        require(tx.origin == msg.sender, "only human");
        _;
    }

    function initialize(
        address signer_,
        IERC20 two_,
        IGarden garden_
    ) public initializer {
        __Ownable_init();
        signer = signer_;
        two = two_;
        garden = garden_;
    }

    function claim(
        uint256 id,
        uint256 amount,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) public onlyHuman {
        _claim(id, amount, r, s, v);
    }

    function _claim(
        uint256 id,
        uint256 amount,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) internal {
        require(claimRecord[id][msg.sender] == 0, "HAD CLAIMED");
        require(
            keccak256(abi.encodePacked(msg.sender, id, amount)).toEthSignedMessageHash().recover(v, r, s) == signer,
            "claim:Invalid signarure"
        );
        two.transfer(msg.sender, amount);
        claimRecord[id][msg.sender] = amount;
        claimed[id] += amount;

        emit LogClaim(id, msg.sender, amount);
    }

    function batchClaim(Claim[] memory claims) public onlyHuman {
        uint256 len = claim.length;
        for (uint256 i; i < len; i++) {
            Claim memory c = claim[i];
            _claim(c.id, c.amount, c.r, c.s, c.v);
        }
    }

    function setSigner(address signer_) public onlyOwner {
        signer = signer_;
    }

    function setlimitedOnece(uint256 limitedOnce_) public onlyOwner {
        limitedOnce = limitedOnce_;
    }

    function setTWO(IERC20 newTwo) public onlyOwner {
        two = newTwo;
    }

    function version() public pure returns (uint256) {
        return 16;
    }
}

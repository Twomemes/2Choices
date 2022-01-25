// SPDX-License-Identifier: CC-BY-4.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "../interfaces/IRandoms.sol";

struct SeedState {
    bytes32 requestId;
    uint256 seed;
    bool isAvailable;
}

contract MockRandom is IRandoms {
    using SafeERC20 for IERC20;

    uint256 constant VRF_MAGIC_SEED = uint256(keccak256("Kepler452b"));

    bytes32 public constant RANDOMNESS_REQUESTER = keccak256("RANDOMNESS_REQUESTER");

    bytes32 private keyHash;
    uint256 private fee;

    uint256 private seed;

    constructor() {}

    // Views
    function getRandomSeed(address user) external view override returns (uint256) {
        return seed;
    }

    function getRandomSeedUsingHash(address user, bytes32 hash) public view override returns (uint256) {
        return uint256(keccak256(abi.encodePacked(user, seed, hash, gasleft())));
    }

    function setRandom(uint256 _seed) public {
        seed = _seed;
    }
}

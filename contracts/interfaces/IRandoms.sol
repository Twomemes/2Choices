// SPDX-License-Identifier: CC-BY-4.0
pragma solidity ^0.8.0;

interface IRandoms {
    // Views
    function getRandomSeed(address user) external view returns (uint256 seed);

    function getRandomSeedUsingHash(address user, bytes32 hash) external view returns (uint256 seed);
}

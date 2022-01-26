// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAirdrop {
    event Claim(address indexed account, uint256 amount);

    function claim(uint256 amount,
        uint8 v,
        bytes32 r,
        bytes32 s) external;
    function getClaimedAmount() external view returns(uint256);
}

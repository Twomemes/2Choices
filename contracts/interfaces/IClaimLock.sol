// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IClaimLock {
    struct LockedFarmReward {
        uint256 _locked;
        uint256 _blockNumber;
    }

    function lockFarmReward(address account, uint256 amount) external;
    function claimFarmReward(uint256[] memory index) external;
    function getFarmAccInfo(address account) external view returns(LockedFarmReward[] memory lockedReward, uint256[] memory claimableReward) ;
    function getClaimableFarmReward(address account, uint256 index) external view returns(uint256);
}
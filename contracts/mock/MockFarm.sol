// SPDX-License-Identifier: MIT

pragma solidity ^0.8;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../interfaces/IClaimLock.sol";

contract MockFarm {
    IClaimLock lockAdd;

    constructor() {}

    function setClaim(IClaimLock addre) public {
        lockAdd = addre;
    }

    function callLock(uint256 amount) public {
        lockAdd.lockFarmReward(msg.sender, amount);
    }
}

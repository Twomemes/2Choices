// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAirdrop {



    function checkToClaim(address user,uint256 amount,uint256 aid,uint8 v,bytes32 r,bytes32 s)  external view returns (bool,uint256);

}

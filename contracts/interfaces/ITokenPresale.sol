// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITokenPresale {
    event Sale(address indexed account, uint256 part);

    function sale() external payable;
    function getLeftAmount() external view returns(uint256);
    function withdraw() external;
    function withdrawTwo() external;

}
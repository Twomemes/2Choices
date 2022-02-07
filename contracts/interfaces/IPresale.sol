// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPresale {
    event Sale(address indexed account);

    function sale() external payable;
    function withdraw() external;
    function withdrawTwo() external;
    function getLeftAmount() external view returns(uint256);
}
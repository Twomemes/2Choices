// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITokenPresale {
    event Sale(address indexed account);
    event WhiteListSale(address indexed account);

    function whiteListSale(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external payable;

    function sale() external payable;
    function withdraw() external;
    function withdrawTwo() external;
    function getLeftAmount() external view returns(uint256);
    function checkCurrentPeriod() external view returns(uint256);
}
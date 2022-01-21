// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBlindBox {
    event BuyABox(address indexed account, uint256 ticketType);
    event BuyBBox(address indexed account, uint256 ticketType);

    function aBoxOpen(uint256 num) external;
    function bBoxOpen(uint256 num) external;
    function combine(uint256[3] memory ticket, uint256[] memory extraCap) external;
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOpenBox {
    event Claim(address indexed account);
    event BuyTicket(address indexed account, uint256 num);

    function claim() external;

    function buyTicket(uint256 num) external;

    function getClaimLimit(address account) external view returns (uint256 claimLimit);
}

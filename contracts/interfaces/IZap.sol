// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IZap {
    function isLP(address lpToken) external view returns (bool);

    function zapInToken(
        address from,
        uint256 amount,
        address to
    ) external;

    function zapIn(address to) external payable;

    function zapOut(address from, uint256 amount) external;
}

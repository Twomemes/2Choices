// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface IMysteryBox is IERC721Enumerable {
    function mint(address _to) external;

    function batchMint(address _to, uint256 num) external;
}

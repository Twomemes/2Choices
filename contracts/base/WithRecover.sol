// SPDX-License-Identifier: CC-BY-4.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "./WithAdminRole.sol";

contract WithRecover is WithAdminRole {
    function __WithRecover_init() internal initializer {
        __WithAdminRole_init();
    }

    function recoverERC20(IERC20Upgradeable _token, uint256 amount) public restricted {
        _token.transfer(msg.sender, amount);
    }

    function withDraw(uint256 amount) public restricted {
        msg.sender.call{value: amount}("");
    }

    function recoverERC721(IERC721Upgradeable _token, uint256[] memory tokenIds) public restricted {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _token.safeTransferFrom(address(this), msg.sender, tokenIds[i]);
        }
    }

    fallback() external payable virtual {}

    receive() external payable virtual {}
}

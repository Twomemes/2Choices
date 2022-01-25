// SPDX-License-Identifier: CC-BY-4.0
pragma solidity ^0.8.0;

import {IBaseERC721} from "../interfaces/IBaseERC721.sol";
import "./BaseERC721.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

import "./WithAdminRole.sol";

abstract contract AllowERC721 is BaseERC721 {
    modifier checkAllowByTokenId(uint256 tokenId) {
        bool isAllow = allowTransfer(tokenId);
        require(isAllow, "Using");
        _;
    }

    function allowTransfer(uint256 tokenId) public view virtual returns (bool isAllow) {
        isAllow = true;
    }

    function __AllowERC721_init(string memory name, string memory symbol_) public initializer {
        __BaseERC721_init(name, symbol_);
    }

    function batchTransfer(address[] memory to, uint256[] memory tokenIds) public override {
        uint256 toLen = to.length;
        require(toLen == tokenIds.length, "LNE"); // length not equal
        for (uint256 i = 0; i < toLen; i++) {
            require(allowTransfer(tokenIds[i]), "Can not transfer");
            _transfer(msg.sender, to[i], tokenIds[i]);
        }
    }

    function batchTransferSame(address to, uint256[] memory tokenIds) public override {
        uint256 len = tokenIds.length;
        for (uint256 i = 0; i < len; i++) {
            require(allowTransfer(tokenIds[i]), "Can not transfer");
            _transfer(msg.sender, to, tokenIds[i]);
        }
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override checkAllowByTokenId(tokenId) {
        super.safeTransferFrom(from, to, tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override checkAllowByTokenId(tokenId) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) public override checkAllowByTokenId(tokenId) {
        super.safeTransferFrom(from, to, tokenId, data);
    }
}

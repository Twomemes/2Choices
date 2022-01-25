// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-IERC20PermitUpgradeable.sol";
// import {IERC20MetadataUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
// import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import {IERC20} from "../interfaces/IERC20.sol";

interface ITwoToken is IERC20, IERC20PermitUpgradeable {
    function mint(address to, uint256 amount) external;
}

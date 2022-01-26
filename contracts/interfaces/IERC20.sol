// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {IERC20 as OIERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

interface IERC20 is OIERC20, IERC20Metadata {}

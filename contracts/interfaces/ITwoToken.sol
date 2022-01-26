// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import {IERC20} from "../interfaces/IERC20.sol";

interface ITwoToken is IERC20, IERC20Permit {
    function mint(address to, uint256 amount) external;

    function burn(uint256 amount) external;
}

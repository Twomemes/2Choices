import {IERC20} from "../interfaces/IERC20.sol";

interface MockTwo is IERC20 {
    function MINTER() external view returns (bytes32);

    function grantRole(bytes32 role, address account) external;
}

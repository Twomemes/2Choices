import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {ITwoToken} from "../interfaces/ITwoToken.sol";

contract TwoToken is ERC20PermitUpgradeable, ITwoToken, AccessControlUpgradeable {
    bytes32 public constant MINTER = keccak256("MINTER");
    uint256 public constant MAX_SUPPLY = 222222222_222222222222222222;

    event Mint(address indexed mintTo, address minter, uint256 amount);

    function initialize()
        public
        // string memory name,
        // string memory symbol,
        // uint256 initializedSupply
        initializer
    {
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        __ERC20Permit_init("TWO");
        __ERC20_init("2Choices", "TWO");
        //    _setRoleAdmin(MINTER, DEFAULT_ADMIN_ROLE);
    }

    function mint(address to, uint256 amount) public override onlyRole(MINTER) {
        require(totalSupply() + amount <= MAX_SUPPLY, "too much supply");
        _mint(to, amount);
        emit Mint(to, msg.sender, amount);
    }

    function version() public pure returns (uint256) {
        return 5;
    }
}

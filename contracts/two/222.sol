// import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
// import "@openzeppelin/contracts/access/AccessControl.sol";
// import {ITwoToken} from "../interfaces/ITwoToken.sol";

// contract TwoToken is ERC20Permit, ITwoToken, AccessControl {
//     bytes32 public constant MINTER = keccak256("MINTER");
//     uint256 public constant MAX_SUPPLY = 222222222_222222222222222222;

//     event Mint(address indexed mintTo, address minter, uint256 amount);

//     constructor() ERC20Permit("SpookyToken")
//     {
//         ERC20("SpookyToken", "BOO");
//     }

//     function mint(address to, uint256 amount) public override onlyFarm {
//         require(totalSupply() + amount <= MAX_SUPPLY, "too much supply");
//         _mint(to, amount);
//         emit Mint(to, msg.sender, amount);
//     }

//     function getChainId() internal view returns (uint) {
//         uint256 chainId;
//         assembly { chainId := chainid() }
//         return chainId;
//     }
// }

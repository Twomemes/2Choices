pragma solidity ^0.8.0;
import "../interfaces/IPancakePair.sol";
import "../interfaces/IFtmOracle.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract FtmOracle is OwnableUpgradeable, IFtmOracle {
    IPancakePair public _ftmLP;
    IERC20 public _wftm;
    IERC20 public _usdc;
    uint256 constant USDC_PRICE = 10 ** 6;
    uint256 constant SIX_DECIMAL = 10 ** 6;
    uint256 constant EIGHTEEN_DECIMAL = 10 ** 18;

    function initialize(address ftmlp, IERC20 wftm, IERC20 usdc) public initializer {
        __Ownable_init();
        _ftmLP = IPancakePair(ftmlp);
        _wftm = wftm;
        _usdc = usdc;
    }

    function ftmPrice() public override view returns (uint256) {
        uint256 ftmTotal = _wftm.balanceOf(address(_ftmLP));
        uint256 usdcTotal = _usdc.balanceOf(address(_ftmLP)) / SIX_DECIMAL * EIGHTEEN_DECIMAL;

        return (USDC_PRICE * usdcTotal) / ftmTotal;
    }

    function setLP(IPancakePair newLP) public onlyOwner {
        _ftmLP = newLP;
    }

    function setWftm(IERC20 newWftm) public onlyOwner {
        _wftm = newWftm;
    }

    function setUsdc(IERC20 newUsdc) public onlyOwner {
        _usdc = newUsdc;
    }
}
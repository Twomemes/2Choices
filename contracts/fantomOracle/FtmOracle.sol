pragma solidity ^0.8.0;
import "../interfaces/IPancakePair.sol";
import "../squid/IAggregatorInterface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract FtmOracle is OwnableUpgradeable, IAggregatorInterface{
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

    function latestAnswer() public override view returns (uint256) {
        return ftmPrice();
    }

    function historyAnswer(uint32 startTime, uint32 endTime) public override view returns (uint256) {

    }

    function ftmPrice() internal view returns (uint256) {
        uint256 usdcAccur = 10 ** 4;
        uint256 ftmTotal = _wftm.balanceOf(address(_ftmLP));
        uint256 usdcTotal = _usdc.balanceOf(address(_ftmLP)) / SIX_DECIMAL * EIGHTEEN_DECIMAL;

        return (usdcAccur * usdcTotal) / ftmTotal;
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

    function version() public pure returns (uint256) {
        return 2;
    }
}
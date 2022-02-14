pragma solidity ^0.8.0;

import "../base/WithAdminRole.sol";

import {IVault} from "../interfaces/IVault.sol";
import {IFairLaunch} from "../interfaces/IFairLaunch.sol";
import "../interfaces/IERC20.sol";

import {IGarden} from "../interfaces/IGarden.sol";

import "../interfaces/IPancakePair.sol";

contract Tools is WithAdminRole {
    IPancakePair public twoFtmLp;
    IERC20 public two;
    IERC20 public wftm;
    IGarden public garden;

    uint256 public ftmPrice; // * 10000

    function initialize() public initializer {
        __WithAdminRole_init();
    }

    function twoPrice() public view returns (uint256) {
        uint256 twoBl = two.balanceOf(address(twoFtmLp));
        uint256 ftmBl = wftm.balanceOf(address(twoFtmLp));

        // u/ftm * ftm / two

        return (ftmPrice * ftmBl) / twoBl;
    }

    function twoLpPrice() public view returns (uint256) {
        uint256 twoBl = two.balanceOf(address(twoFtmLp));
        uint256 ftmBl = wftm.balanceOf(address(twoFtmLp));
        uint256 lpBl = twoFtmLp.totalSupply();
        // (two price * two +   wftm price * wftm )/ lp valumn
        return (twoPrice() * twoBl + ftmPrice * ftmBl) / lpBl;
    }

    function apr(uint256 pid) public view returns (uint256) {
        if (pid == 0) {
            return ftmApr2();
        } else if (pid == 1) {
            return lpApr2();
        }
    }

    function apr2(uint256 pid) public view returns (uint256) {
        if (pid == 0) {
            return ftmApr();
        } else if (pid == 1) {
            return lpApr();
        }
    }

    function lpApr() public view returns (uint256) {
        return
            ((garden.daylyReward(1) * twoPrice()) * 365 * 10000) / (twoFtmLp.balanceOf(address(garden)) * twoLpPrice());
    }

    function lpApr2() public view returns (uint256) {
        uint256 twoBl = two.balanceOf(address(twoFtmLp));
        return (garden.daylyReward(1) * 365 * 10000) / (twoBl * 2);
    }

    function ftmApr2() public view returns (uint256) {
        uint256 twoBl = two.balanceOf(address(twoFtmLp));
        uint256 ftmBl = wftm.balanceOf(address(twoFtmLp));

        uint256 staking = wftm.balanceOf(address(garden));
        return (garden.daylyReward(0) * 365 * 10000) / ((staking * twoBl) / ftmBl);
    }

    function ftmApr() public view returns (uint256) {
        return ((((garden.daylyReward(0) * twoPrice()) * 365 * 10000) / (wftm.balanceOf(address(garden)))) * ftmPrice);
    }

    function setGarden(IGarden _garden) public {
        garden = _garden;
    }

    function setTwoFtmLp(IPancakePair _twoFtmLp) public {
        twoFtmLp = _twoFtmLp;
    }

    function setTwo(IERC20 _two) public {
        two = _two;
    }

    function setWftm(IERC20 _wftm) public {
        wftm = _wftm;
    }

    function setFtmPrice(uint256 _price) public {
        ftmPrice = _price;
    }

    function approve(IERC20 token, address spender) public {
        token.approve(spender, type(uint256).max);
    }

    function spiltETH(address[] memory recipients, uint256[] memory amounts) public payable {
        uint256 len = recipients.length;
        for (uint256 i; i < len; i++) {
            recipients[i].call{value: amounts[i]}(new bytes(0));
        }
    }

    receive() external payable {}

    function version() public pure returns (uint256) {
        return 12;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";
contract MockSquid is  OwnableUpgradeable {
   

    function initialize() public initializer {
        __Ownable_init();
    }

    receive() external payable {}

    function getAward() public returns (uint256){
        
        uint256 bonus;

    
        uint256 baseAward = 40 ether;
        uint256 totalBonus = 1000 ether;
        uint256 joinOrder = 1;
        uint256 totalNum=2;
        uint256 _beforeAwrdNum = 1000;
        uint256 _lastAwardNum = 22;
        uint256 winChip=10;
        uint256 _totalWinnerChip=10;
        if(joinOrder >0){
            uint256 lastUserAward = (totalBonus * 30) / 1000;
            if (totalNum - joinOrder < _lastAwardNum) {
                uint256 lastAwrdUser = totalNum < _lastAwardNum
                    ? totalNum
                    : _lastAwardNum;
                bonus += lastUserAward / lastAwrdUser;
            }
            
            console.log('bonus **********1',bonus);
            if (joinOrder < _beforeAwrdNum) {
                uint256 beforeAwrdUser = totalNum < _beforeAwrdNum
                    ? totalNum
                    : _beforeAwrdNum;
                console.log('bonus **********11',beforeAwrdUser);
                for (uint256 i = joinOrder; i < beforeAwrdUser; i++) {
                    bonus += (baseAward/ i);
                }
            }
            console.log('bonus **********2',bonus);
            if (winChip > 0) {
                console.log('total bonus .............0',totalBonus);
                totalBonus = totalBonus - lastUserAward;
                console.log('total bonus .............1',totalBonus);
                if (totalNum < _beforeAwrdNum) {
                    totalBonus -= (totalNum - 1) * baseAward;
                } else {
                    totalBonus -= _beforeAwrdNum * baseAward;
                }
                console.log('total bonus .............2',totalBonus);
                bonus += (totalBonus*winChip/_totalWinnerChip);
            }
        }
        console.log('bonus **********3',bonus);
        return bonus;
    }
}

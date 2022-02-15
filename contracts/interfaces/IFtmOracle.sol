pragma solidity ^0.8.0;

interface IFtmOracle {
    
    function ftmPrice() external view returns (uint256);
}
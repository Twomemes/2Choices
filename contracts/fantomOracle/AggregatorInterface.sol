pragma solidity ^0.8.0;

import "../squid/IAggregatorInterface.sol";
import "../interfaces/IFtmOracle.sol";
contract AggregatorInterface is IAggregatorInterface {
    address public _oracle;

    function latestAnswer() public override view returns (uint256) {
        return IFtmOracle(_oracle).ftmPrice();
    }

    function historyAnswer(uint32 startTime, uint32 endTime) public override view returns (uint256) {

    }
}
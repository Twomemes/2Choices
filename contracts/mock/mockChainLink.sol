// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";

// interface AggregatorInterface {
//     function latestAnswer() external view returns(uint256);
// }

contract MockChainLink is Ownable {
    uint256 _lastAnswer;

    function setLatestAnswer(uint256 answer) public {
        _lastAnswer = answer;
    }

    function latestAnswer() public view returns (uint256) {
        if (_lastAnswer != 0) {
            return _lastAnswer;
        } else {
            uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.timestamp))) % 100;
            return randomNumber;
        }
    }

    function random(uint256 answer) public returns (uint256) {
        _lastAnswer = answer;
        return _lastAnswer;
    }
}

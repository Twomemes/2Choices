pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/Math.sol";

contract MockClaimLock {
    Record[] public record;

    struct Record {
        address owner;
        uint256 value;
        uint256 timestamp;
        uint256 blocknumber;
    }

    function getRecord(uint256 from, uint256 to) public view returns (Record[] memory records) {
        to = Math.min(to, record.length);
        uint256 len = to - from;
        records = new Record[](len);
        for (uint256 i = from; i < to; i++) {
            records[i - from] = record[i];
        }
    }

    function lockFarmReward(address account, uint256 amount) public {
        record.push(Record({owner: account, value: amount, timestamp: block.timestamp, blocknumber: block.number}));
    }
}

// SPDX-License-Identifier: CC-BY-4.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../base/RandomUtil.sol";
import "../interfaces/IRandoms.sol";

contract MockWithRandom is Initializable {
    IRandoms _randoms;
    uint256 seed;

    function __WithRandom_init(IRandoms randoms) internal initializer {
        __WithRandom_init_unchained(randoms);
    }

    function __WithRandom_init_unchained(IRandoms randoms) internal initializer {
        _randoms = randoms;
    }

    function random(uint256 min, uint256 max) internal view returns (uint256 _randomNumber) {
        uint256 seed = _randoms.getRandomSeed(msg.sender);
        _randomNumber = seed;
    }

    function setRandom(uint256 newSeed) public {
        seed = newSeed;
    }

    function randomWithSeed(
        uint256 min,
        uint256 max,
        uint256 seed
    ) internal view returns (uint256 _randomNumber) {
        uint256 fullSeed = uint256(
            keccak256(abi.encodePacked(msg.sender, seed, blockhash(block.number - 1), gasleft()))
        );
        _randomNumber = RandomUtil.randomSeededMinMax(min, max, fullSeed);
    }

    function currentDayth() public view returns (uint256) {
        return block.timestamp / (24 * 3600);
    }
}

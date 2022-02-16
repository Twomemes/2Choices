// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Airdrop is OwnableUpgradeable {
    using ECDSAUpgradeable for bytes32;

    event Claim(uint256 indexed aid, address indexed account, uint256 amount);

    address public _signer;
    address public _airdropVault;
    IERC20 public _two;
    mapping(uint256 => mapping(address => uint256)) public _claimList;

    Airdrop[] public _airdrop;
    struct Airdrop {
        uint256 remain;
        uint256 total;
        uint256 count;
        uint256 startTime;
        uint256 endTime;
        string desc;
    }

    function initialize(
        address signer,
        address airdropVault,
        IERC20 two
    ) public initializer {
        __Ownable_init();
        _signer = signer;
        _airdropVault = airdropVault;
        _two = two;
    }

    function setAirdropEnd(uint256 aid, uint256 endTime) public onlyOwner {
        require(aid < _airdrop.length);
        _airdrop[aid].endTime = endTime;
    }

    function claim(
        uint256 aid,
        uint256 amount,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        uint256 currentTime = block.timestamp;
        Airdrop storage airdrop = _airdrop[aid];
        require(airdrop.startTime < currentTime, "not started yet");
        require(airdrop.endTime > currentTime, "expired");
        require(airdrop.count < airdrop.remain, "out of remain");

        require(_claimList[aid][msg.sender] == 0, "HAD CLAIMED");
        require(
            keccak256(abi.encodePacked(msg.sender, aid, amount)).toEthSignedMessageHash().recover(v, r, s) == _signer,
            "claim:Invalid signarure"
        );
        _two.transferFrom(_airdropVault, msg.sender, amount);
        _claimList[aid][msg.sender] = amount;
        airdrop.count += 1;
        airdrop.total += amount;

        emit Claim(aid, msg.sender, amount);
    }

    function checkToClaim(address user,uint256 amount,uint256 aid,uint8 v,bytes32 r,bytes32 s) public returns (bool,uint256){
        uint256 currentTime = block.timestamp;
        Airdrop storage airdrop = _airdrop[aid];
        require(airdrop.startTime < currentTime, "not started yet");
        require(airdrop.endTime > currentTime, "expired");
        require(airdrop.count < airdrop.remain, "out of remain");

        require(_claimList[aid][user] == 0, "HAD CLAIMED");
        bytes32 hash=keccak256(abi.encodePacked(user, aid, amount)).toEthSignedMessageHash();
        require(
            hash.recover(v, r, s) == _signer,
            "claim:Invalid signarure"
        );
        _claimList[aid][user] = amount;
        airdrop.count += 1;
        airdrop.total += amount;
        return (true,airdrop.endTime);
    }

    function getAirdrops() public view returns (Airdrop[] memory) {
        return _airdrop;
    }

    function getAirdropsAid() public view returns (uint256) {
        return _airdrop.length;
    }

    function addAirdrop(Airdrop memory airdrop) public onlyOwner {
        _airdrop.push(airdrop);
    }

    function addAirdrop2(uint256 remain,uint256 startTime,uint256 endTime) public onlyOwner {
        Airdrop memory airdrop;
        airdrop.remain=remain;
        airdrop.total=0;
        airdrop.count=0;
        airdrop.startTime=startTime;
        airdrop.endTime=endTime;
        _airdrop.push(airdrop);
    }

    function setSigner(address signer) public onlyOwner {
        _signer = signer;
    }

    function airDropEnd(address airdropAdress) public onlyOwner {
        _two.transfer(airdropAdress, _two.balanceOf(address(this)));
    }

    function setTWO(IERC20 newTwo) public onlyOwner {
        _two = newTwo;
    }

    function version() public pure returns (uint256) {
        return 15;
    }
}

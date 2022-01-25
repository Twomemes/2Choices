pragma solidity ^0.8.0;
import "./IBaseERC721.sol";

interface IKakiCaptain is IBaseERC721 {
    struct CapPara {
        uint256 captainType;
        uint256 memberNum;
        uint256 miningRate;
        uint256 combineRate;
        string capName;
    }

    struct CapStatus {
        bool noTransfer;
        bool noCreateTeam;
    }

    function mint(address _to, uint256 _tokenId) external;

    function setCapTransfer(uint256 tokenId) external;

    function setCapCreate(uint256 tokenId) external;

    function getCapType(uint256 tokenId) external view returns (uint256);

    function getCapComb(uint256 tokenId) external view returns (uint256);

    function getCapStatus(uint256 tokenId) external view returns (CapStatus memory capStatus);

    function getCapInfo(uint256 tokenId) external view returns (CapPara memory capPara);
}

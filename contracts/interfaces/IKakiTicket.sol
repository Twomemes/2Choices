pragma solidity ^0.8.0;
import "./IBaseERC721.sol";

interface IKakiTicket is IBaseERC721 {
    struct TicketPara {
        uint256 chip;
        uint256 prob;
        uint256 price;
        uint256 ticketType;
    }

    function mint(
        address _to,
        uint256 _chip,
        uint256 _prob,
        uint256 _price,
        uint256 _ticketType
    ) external returns (uint256 tokenId);

    function getTicketInfo(uint256 tokenId) external view returns (TicketPara memory);
}

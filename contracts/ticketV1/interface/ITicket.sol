// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../../interfaces/IBaseERC721.sol";

interface ITicket is IBaseERC721 {
    struct TicketPara {
        uint256 invalidTime;
        uint256 birthday;
        uint256 birthBlock;
        uint256 value;
        uint256 price;
        uint256 tokenId;
        bool isDrop;
    }

    function mint(
        address _to,
        bool _isDrop,
        uint256 _invalidTime,
        uint256 value,
        uint256 price
    ) external returns (uint256 tokenId);

    function getTicketInfo(uint256 tokenId) external view returns (TicketPara memory);

    function getUserTokenInfo(address user) external view returns (TicketPara[] memory ticketList);
}

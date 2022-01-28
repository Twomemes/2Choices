// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../interfaces/IKakiTicket.sol";
import "../base/BaseERC721.sol";

contract KakiTicket is IKakiTicket, BaseERC721 {
    mapping(uint256 => TicketPara) _ticketPara;

    function initialize() public initializer {
        __BaseERC721_init("2Choices Ticket", "TCT");
        increaceTokenId();
    }

    function mint(
        address _to,
        uint256 _chip,
        uint256 _prob,
        uint256 _price,
        uint256 _ticketType
    ) external override restricted returns (uint256 tokenId) {
        tokenId = totalMinted();
        _mint(_to, tokenId);
        _ticketPara[tokenId].ticketType = _ticketType;
        _ticketPara[tokenId].chip = _chip;
        _ticketPara[tokenId].price = _price;
        _ticketPara[tokenId].prob = _prob;
        increaceTokenId();
    }

    function getTicketInfo(uint256 tokenId) external view override returns (TicketPara memory) {
        return (_ticketPara[tokenId]);
    }

    function version() public pure returns (uint256) {
        return 3;
    }
}

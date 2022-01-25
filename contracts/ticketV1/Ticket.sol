// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../base/BaseERC721.sol";
import "./interface/ITicket.sol";

contract Ticket is BaseERC721, ITicket {
    mapping(uint256 => TicketPara) _ticketInfo;

    function initialize() public initializer {
        __BaseERC721_init("Kaki Squid Ticket", "KST");
    }

    function mint(
        address _to,
        bool _isDrop,
        uint256 _invalidTime,
        uint256 value,
        uint256 price
    ) external override restricted returns (uint256 tokenId) {
        tokenId = totalMinted();
        _mint(_to, tokenId);
        _ticketInfo[tokenId] = TicketPara({
            invalidTime: _invalidTime,
            birthday: block.timestamp,
            birthBlock: block.number,
            value: value,
            price: price,
            tokenId: tokenId,
            isDrop: _isDrop
        });
        increaceTokenId();
    }

    function getTicketInfo(uint256 tokenId) public view override returns (TicketPara memory) {
        return (_ticketInfo[tokenId]);
    }

    function getUserTokenInfo(address user) public view override returns (TicketPara[] memory ticketList) {
        uint256[] memory tokenList = tokensOfOwner(user);
        ticketList = new TicketPara[](tokenList.length);
        for (uint256 i; i < tokenList.length; i++) {
            ticketList[i] = getTicketInfo(tokenList[i]);
        }
    }

    function setInvalidTime(uint256[] memory idList, uint256 newTime) public onlyOwner {
        for (uint256 i; i < idList.length; i++) {
            _ticketInfo[idList[i]].invalidTime = newTime;
        }
    }

    function version() public pure returns (uint256) {
        return 4;
    }
}

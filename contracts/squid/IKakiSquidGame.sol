pragma solidity ^0.8.0;

interface IKakiSquidGame {
    struct RoundView {
        uint256 totalCall;
        uint256 totalPut;
        uint256 accCall;
        uint256 accPut;
        uint256 price;
        uint256 roundId;
    }

    event BuyTicket(address indexed account, uint256 amount);
    event AddBonus(address indexed account, uint256 chapter, uint256 amount);
    event PlaceBet(address indexed account, uint256 amount);
    event StartGame(address indexed account, uint256 nftId, uint256 ticketType);
    event Claim(address indexed account, uint256 amount);
    event Settle(address indexed handler, uint256 _lastRound, uint256 time, uint256 price1, uint256 price2);
    event AddLoot(address indexed handler, uint256 time, uint256 bonus);

    function startGame(uint256 nftId) external;

    function claim() external;

    function placeBet(uint256 amount) external;

    function getRoundChip() external view returns (uint256);

    function getUserBonus() external returns (uint256);

    function roundStatus() external view returns (bool);

    function getTotalCall(uint256 chapter, uint256 round) external view returns (uint256);

    function getTotalPut(uint256 chapter, uint256 round) external view returns (uint256);

    function getMyCall(uint256 chapter, uint256 round) external view returns (uint256);

    function getMyPut(uint256 chapter, uint256 round) external view returns (uint256);

    function getCurrentChapterRound() external view returns (uint256, uint256);

    function getHistoryChapMsg(uint256 chapter) external view returns (RoundView[] memory);

    function getTotalBonus(uint256 chapter) external view returns (uint256);

    function getRoundPrice(uint256 chapter, uint256 round) external view returns (uint256, uint256);

    function getTimestamp() external view returns (uint256);

    function getDataForRobot()
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            bool,
            uint256,
            uint256
        );
}

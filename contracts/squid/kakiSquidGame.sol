// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./IKakiSquidGame.sol";
import "./IAggregatorInterface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {IKakiTicket} from "../interfaces/IKakiTicket.sol";
import {IGarden} from "../interfaces/IGarden.sol";
import "../base/WithAdminRole.sol";

contract KakiSquidGame is IKakiSquidGame, WithAdminRole, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    IERC20 internal _token;
    IGarden internal _farmGarden;
    IKakiTicket internal _ticketNFT;
    IAggregatorInterface _aggregator;
    uint256 _roundTime;
    uint256 _roundSum;
    uint256 _tradingTime;
    uint256 _gameInterval;
    uint256 _lastUserAwardRate;
    uint256 _beforeAwrdNum;
    uint256 _lastAwardNum;

    uint256 constant THOUSAND = 10**3;
    address public kakiFoundationAddress;

    uint256 public _chapter;
    uint256 public _lastRound;
    uint256 public _nextGameTime;
    uint256 public _ticketToBonus0;
    uint256 public _ticketToBonus1;

    mapping(uint256 => bool) public isChapterStart;
    mapping(address => User) public _users;

    mapping(uint256 => uint256) public _totalChips;
    mapping(uint256 => uint256) public _joinNum;
    mapping(uint256 => uint256) public _totalBonus;
    mapping(uint256 => uint256) public _totalWinnerChip;

    mapping(uint256 => mapping(uint256 => uint256)) public _finalCall;
    mapping(uint256 => mapping(uint256 => uint256)) public _finalPut;
    mapping(uint256 => mapping(uint256 => uint256)) public _price;
    mapping(uint256 => mapping(uint256 => uint256)) public _lastRoundStartTime;
    mapping(uint256 => mapping(uint256 => mapping(address => uint256))) public _placeCallStatus;
    mapping(uint256 => mapping(uint256 => mapping(address => uint256))) public _placePutStatus;

    address public _kakiPayWalletAddress;

    struct User {
        mapping(uint256 => uint256) _initChip;
        mapping(uint256 => uint256) _joinOrder;
        uint256 _lastCheckChapter;
    }
    modifier onlyNoneContract() {
        require(msg.sender == tx.origin, "only non contract call");
        _;
    }

    /*
     * Contract constructor
     */
    function initialize(
        IKakiTicket nftToken_,
        IGarden farmGarden,
        IERC20 kakiToken,
        IAggregatorInterface aggregator_,
        address payWallet
    ) public initializer {
        __WithAdminRole_init();
        __ReentrancyGuard_init();
        _aggregator = aggregator_;
        _token = kakiToken;
        _ticketNFT = nftToken_;
        _farmGarden = farmGarden;

        _ticketToBonus0 = 156800000000000000000;
        _ticketToBonus1 = 313600000000000000000;
        _nextGameTime = 1644904800; //2021-12-2 16:00:00

        _lastUserAwardRate = 3;
        _beforeAwrdNum = 1000;
        _lastAwardNum = 22;
        _roundSum = 5; //5; //5round
        _gameInterval = 28800; //8hour = 28800 35min =2100  13min=780 60min3600
        _roundTime = 5 * 60; //  5min = 300
        _tradingTime = 3 * 60; //  3min = 180

        kakiFoundationAddress = 0x8329FAdFf375a203B491badFEc7DBAd7D8E0e27e;
        _kakiPayWalletAddress = payWallet;
    }

    function startGame(uint256 nftId) public override onlyNoneContract {
        uint256 b = updateLastCheckChapterAndGetUserBonus();
        if (b > 0) {
            _token.transferFrom(_kakiPayWalletAddress, msg.sender, b);
            emit Claim(msg.sender, b);
        }
        require(_ticketNFT.ownerOf(nftId) == msg.sender, "not owner");
        require(_users[msg.sender]._initChip[_chapter] == 0, "Had bought ticket.");

        uint256 time = getTimestamp();
        require(time < _nextGameTime, "The game is in the play status.");

        _joinNum[_chapter]++;
        _users[msg.sender]._joinOrder[_chapter] = _joinNum[_chapter];

        IKakiTicket.TicketPara memory ticketInfo = _ticketNFT.getTicketInfo(nftId);
        _users[msg.sender]._initChip[_chapter] = ticketInfo.chip;
        _totalChips[_chapter] += ticketInfo.chip;

        uint256 addBonus = ticketInfo.ticketType == 0 ? _ticketToBonus0 : _ticketToBonus1;
        _totalBonus[_chapter] = _totalBonus[_chapter] + addBonus;

        _ticketNFT.transferFrom(msg.sender, address(0xdead), nftId);
        emit StartGame(msg.sender, nftId, ticketInfo.ticketType);
    }

    function myInitChipCurrentChapter() public view returns (uint256) {
        return initChipOfOwner(msg.sender, _chapter);
    }

    function initChipOfOwner(address owner, uint256 chapterId) public view returns (uint256) {
        return _users[owner]._initChip[chapterId];
    }

    function getMyWinChip(uint256 chapter) public view returns (uint256) {
        return getWinChipOfOwner(msg.sender, chapter);
    }

    function getWinChipOfOwner(address owner, uint256 chapter) public view returns (uint256) {
        if (chapter >= _chapter) return 0;
        if (_price[chapter][_roundSum - 1] < _price[chapter][_roundSum])
            return _placeCallStatus[chapter][_roundSum - 1][owner];
        else return _placePutStatus[chapter][_roundSum - 1][owner];
    }

    /*
     * Admin adds additional bonuses to current chapter pool before the game starts
     * @param extraAmount Additional bonuses.
     */
    function addBonus(uint256 extraAmount) public {
        uint256 time = getTimestamp();
        require(extraAmount > 0, "Invalid amount.");
        require(time < _nextGameTime, "The game is in the play status.");
        _totalBonus[_chapter] = _totalBonus[_chapter].add(extraAmount);
        _token.transferFrom(msg.sender, _kakiPayWalletAddress, extraAmount);
        emit AddBonus(msg.sender, _chapter, extraAmount);
    }

    /*
     * User places order
     * @param amount The amount of chip placing call order.
     */
    function placeBet(uint256 amount) public override onlyNoneContract {
        require(roundStatus(), "The current round of trading ends.");
        uint256 roundChip = getRoundChip();
        require(roundChip != 0, "Invalid order place.");
        require(roundChip >= amount, "The number of chips used cannot be greater than the number of remaining chips.");
        require(
            _placeCallStatus[_chapter][_lastRound][msg.sender] == 0 &&
                _placePutStatus[_chapter][_lastRound][msg.sender] == 0,
            "Had placed order in this round"
        );
        //if (_lastRound == _roundSum - 1) _lastRoundUsers.push(msg.sender);

        _placeCallStatus[_chapter][_lastRound][msg.sender] = amount;
        _finalCall[_chapter][_lastRound] = _finalCall[_chapter][_lastRound].add(amount);

        _placePutStatus[_chapter][_lastRound][msg.sender] = roundChip.sub(amount);
        _finalPut[_chapter][_lastRound] = _finalPut[_chapter][_lastRound].add(roundChip.sub(amount));

        emit PlaceBet(msg.sender, amount);
    }

    /*
     * Claim bonus
     */
    function claim() public override onlyNoneContract {
        uint256 b = updateLastCheckChapterAndGetUserBonus();
        require(b > 0, "bonus must > 0.");
        _token.transferFrom(_kakiPayWalletAddress, msg.sender, b);
        emit Claim(msg.sender, b);
    }

    /*
     * Settlement after the end of the round or chapter
     */
    function settle() public {
        uint256 time = getTimestamp();
        uint256 chapterEndTime = _nextGameTime.add((_lastRound + 1).mul(_roundTime));
        uint256 curChapter = _chapter;
        require(chapterEndTime <= time, "This round of trading is not over.");
        _price[_chapter][++_lastRound] = _aggregator.latestAnswer();
        _lastRoundStartTime[_chapter][_lastRound] = chapterEndTime; //time;

        if (_lastRound >= _roundSum) {
            uint256 bonus = _totalBonus[_chapter];
            if (_price[_chapter][_lastRound - 1] < _price[_chapter][_lastRound]) {
                _totalWinnerChip[_chapter] = _finalCall[_chapter][_roundSum - 1];
            } else {
                _totalWinnerChip[_chapter] = _finalPut[_chapter][_roundSum - 1];
            }
            if (_totalWinnerChip[_chapter] == 0) {
                _totalBonus[_chapter + 1] = bonus;
            }
            _chapter++;
            _nextGameTime = _nextGameTime.add(_gameInterval);
        }
        emit Settle(msg.sender, _lastRound, time, _price[curChapter][_lastRound - 1], _price[curChapter][_lastRound]);
    }

    /*
     * Stop buy ticket & start game
     */
    function addLoot() public {
        uint256 time = getTimestamp();
        require(_nextGameTime <= time, "The chapter is not start.");
        require(!isChapterStart[_chapter], "The chapter is already start.");

        //_nextGameTime = time;
        _totalBonus[_chapter] += _farmGarden.virtualPoolClaim(0,_kakiPayWalletAddress);
        isChapterStart[_chapter] = true;
        _lastRound = 0;
        _lastRoundStartTime[_chapter][_lastRound] = time;
        _price[_chapter][0] = _aggregator.latestAnswer();
        emit AddLoot(msg.sender, _nextGameTime, _totalBonus[_chapter]);
    }

    function getRoundChip() public view override returns (uint256) {
        if (_lastRound == 0) return _users[msg.sender]._initChip[_chapter];
        if (_price[_chapter][_lastRound - 1] < _price[_chapter][_lastRound])
            return _placeCallStatus[_chapter][_lastRound - 1][msg.sender];
        else return _placePutStatus[_chapter][_lastRound - 1][msg.sender];
    }

    function getUserBonus() public view override returns (uint256) {
        uint256 winChip;
        uint256 bonus;
        uint256 lastCheckChapter = _users[msg.sender]._lastCheckChapter;
        uint256 baseAward = 40 ether;
        if (_totalWinnerChip[lastCheckChapter] > 0 && lastCheckChapter != _chapter) {
            if (_price[lastCheckChapter][_roundSum - 1] < _price[lastCheckChapter][_roundSum])
                winChip = _placeCallStatus[lastCheckChapter][_roundSum - 1][msg.sender];
            else winChip = _placePutStatus[lastCheckChapter][_roundSum - 1][msg.sender];
        }

        uint256 totalBonus = _totalBonus[lastCheckChapter];
        uint256 joinOrder = _users[msg.sender]._joinOrder[lastCheckChapter];
        uint256 lastUserAward = (totalBonus * _lastUserAwardRate) / THOUSAND;
        if (_joinNum[lastCheckChapter] - joinOrder < _lastAwardNum) {
            uint256 lastAwrdUser = _joinNum[lastCheckChapter] < _lastAwardNum
                ? _joinNum[lastCheckChapter]
                : _lastAwardNum;
            bonus += lastUserAward / (lastAwrdUser);
        }
        
        if (joinOrder < _beforeAwrdNum) {
            uint256 beforeAwrdUser = _joinNum[lastCheckChapter] > _beforeAwrdNum
                ? _joinNum[lastCheckChapter]
                : _beforeAwrdNum;
            for (uint256 i = joinOrder; i <= beforeAwrdUser; i++) {
                bonus += baseAward/ i;
            }
        }
        if (winChip > 0) {
            totalBonus = totalBonus - lastUserAward;
            if (_joinNum[lastCheckChapter] < _beforeAwrdNum) {
                totalBonus -= (_joinNum[lastCheckChapter] - 1) * baseAward;
            } else {
                totalBonus -= _beforeAwrdNum * baseAward;
            }
            bonus = totalBonus.mul(winChip).div(_totalWinnerChip[lastCheckChapter]);
        }

        
        return bonus;
    }

    function updateLastCheckChapterAndGetUserBonus() internal returns (uint256) {
        uint256 bonus = getUserBonus();
        _users[msg.sender]._lastCheckChapter = _chapter;
        return bonus;
    }

    function roundStatus() public view override returns (bool) {
        uint256 time = getTimestamp();
        uint256 currentRoundTime = _lastRoundStartTime[_chapter][_lastRound];
        if ((currentRoundTime + _tradingTime) > time && time >= currentRoundTime) return true;
        else return false;
    }

    function getTotalCall(uint256 chapter, uint256 round) public view override returns (uint256) {
        return _finalCall[chapter][round];
    }

    function getTotalPut(uint256 chapter, uint256 round) public view override returns (uint256) {
        return _finalPut[chapter][round];
    }

    function getMyCall(uint256 chapter, uint256 round) public view override returns (uint256) {
        return _placeCallStatus[chapter][round][msg.sender];
    }

    function getMyPut(uint256 chapter, uint256 round) public view override returns (uint256) {
        return _placePutStatus[chapter][round][msg.sender];
    }

    function getCurrentChapterRound() public view override returns (uint256, uint256) {
        return (_chapter, _lastRound);
    }

    function getHistoryChapMsg(uint256 chapter) public view override returns (RoundView[] memory chap) {
        chap = new RoundView[](_roundSum + 1);
        for (uint256 i; i < _roundSum; i++) {
            chap[i].totalCall = getTotalCall(chapter, i);
            chap[i].totalPut = getTotalPut(chapter, i);
            chap[i].accCall = getMyCall(chapter, i);
            chap[i].accPut = getMyPut(chapter, i);
            chap[i].price = _price[chapter][i];
            chap[i].roundId = i;
        }
        chap[_roundSum].price = _price[chapter][_roundSum];
    }

    function getTotalBonus(uint256 chapter) public view override returns (uint256) {
        return _totalBonus[chapter];
    }

    function getRoundPrice(uint256 chapter, uint256 round) public view override returns (uint256, uint256) {
        return (_price[chapter][round], _price[chapter][round + 1]);
    }

    function getTimestamp() public view override returns (uint256) {
        return block.timestamp;
    }

    function getDataForRobot()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            bool,
            uint256,
            uint256
        )
    {
        return (
            block.timestamp,
            _nextGameTime,
            _chapter,
            isChapterStart[_chapter],
            _lastRound,
            _lastRoundStartTime[_chapter][_lastRound]
        );
    }

    function getNextGameTime(uint256 random) public view returns (uint256) {
        return _nextGameTime;
    }

    function getCurrentChapter(uint256 random) public view returns (uint256) {
        return _chapter;
    }

    function getLastRound(uint256 random) public view returns (uint256) {
        return _lastRound;
    }

    function updateNextGameTime(uint256 gameTime) public onlyOwner {
        require(!isChapterStart[_chapter], "The chapter is already start.");
        _nextGameTime = gameTime;
    }

    /*
     * Update the receiving address of Kaki foundation
     * @param newKakiFoundationAddress New receiving address
     */
    function updateKakiFoundationAddress(address newKakiFoundationAddress) public onlyOwner {
        require(newKakiFoundationAddress != address(0), "The address cannot be 0.");
        kakiFoundationAddress = newKakiFoundationAddress;
    }

    /*
     * Update the address of Oracle
     * @param oracleAddress New oracle Address
     */
    function updateKakiOracleAddress(address oracleAddress) public onlyOwner {
        require(oracleAddress != address(0), "The address cannot be 0.");
        _aggregator = IAggregatorInterface(oracleAddress);
    }

    function updateGameInterval(uint256 gameInterval) public onlyOwner {
        require(gameInterval >= 1800, "invalid data");
        _gameInterval = gameInterval;
    }

    function chapterInvalid(uint256 nextTime) public onlyOwner {
        uint256 bonus = _totalBonus[_chapter];
        if (bonus != 0) {
            _token.transferFrom(_kakiPayWalletAddress, kakiFoundationAddress, bonus);
        }
        _chapter++;
        _nextGameTime = nextTime;
    }

    function setAggregateContract(IAggregatorInterface aggregator) public onlyOwner {
        _aggregator = aggregator;
    }

    function setKakiPayWallet(address wallet) public onlyOwner {
        _kakiPayWalletAddress = wallet;
    }

    function setFarm(IGarden newFarm) public onlyOwner {
        _farmGarden = newFarm;
    }

    function setTwoToken(IERC20 newTwo) public onlyOwner {
        _token = newTwo;
    }

    function version() public pure returns (uint256) {
        return 19;
    }
}

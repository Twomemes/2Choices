// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../base/WithAdminRole.sol";
import "../interfaces/IPancakePair.sol";
import "../interfaces/IPancakeRouter02.sol";
import "../interfaces/IZap.sol";
import "../interfaces/IWETH.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract KakiZap is IZap, WithAdminRole {
    address private constant KAKI = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;
    address private constant BUSD = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;
    address private constant WBNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address public kakiFoundation;
    address public safeSwapBNB;
    address[] public tokens;
    IPancakeRouter02 public ROUTER;
    mapping(address => bool) private notLPToken;

    function initialize() public initializer {
        __WithAdminRole_init();
        ROUTER = IPancakeRouter02(0x10ED43C718714eb63d5aA57B78B54704E256024E);
        kakiFoundation = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;
        setNotLP(KAKI);
        setNotLP(WBNB);
        setNotLP(BUSD);
    }

    receive() external payable {}

    function zapInToken(
        address from,
        uint256 amount,
        address to
    ) public override {
        IERC20(from).transferFrom(msg.sender, address(this), amount);
        _approveTokenIfNeeded(from);
        if (isLP(to)) {
            IPancakePair pair = IPancakePair(to);
            address token0 = pair.token0();
            address token1 = pair.token1();
            if (from == token0 || from == token1) {
                address other = from == token0 ? token1 : token0;
                _approveTokenIfNeeded(other);
                uint256 halfAmount = amount / 2;
                uint256 otherAmount = _swap(from, halfAmount, other, address(this));
                pair.skim(address(this));
                ROUTER.addLiquidity(from, other, amount - halfAmount, otherAmount, 0, 0, msg.sender, block.timestamp);
            } else {
                uint256 bnbAmount = from == WBNB
                    ? _safeSwapToBNB(amount)
                    : _swapTokenForBNB(from, amount, address(this));
                _swapBNBToLp(to, bnbAmount, msg.sender);
            }
        } else {
            _swap(from, amount, to, msg.sender);
        }
    }

    function zapIn(address to) public payable override {
        _swapBNBToLp(to, msg.value, msg.sender);
    }

    function zapOut(address from, uint256 amount) public override {
        IERC20(from).transferFrom(msg.sender, address(this), amount);
        _approveTokenIfNeeded(from);

        if (!isLP(from)) {
            _swapTokenForBNB(from, amount, msg.sender);
        } else {
            IPancakePair pair = IPancakePair(from);
            address token0 = pair.token0();
            address token1 = pair.token1();

            if (pair.balanceOf(from) > 0) {
                pair.burn(address(this));
            }

            if (token0 == WBNB || token1 == WBNB) {
                ROUTER.removeLiquidityETH(token0 != WBNB ? token0 : token1, amount, 0, 0, msg.sender, block.timestamp);
            } else {
                ROUTER.removeLiquidity(token0, token1, amount, 0, 0, msg.sender, block.timestamp);
            }
        }
    }

    function _approveTokenIfNeeded(address token) private {
        if (IERC20(token).allowance(address(this), address(ROUTER)) == 0) {
            IERC20(token).approve(
                address(ROUTER),
                uint256(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)
            );
        }
    }

    function _swapBNBToLp(
        address lp,
        uint256 amount,
        address receiver
    ) private {
        if (!isLP(lp)) {
            _swapBNBForToken(lp, amount, receiver);
        } else {
            IPancakePair pair = IPancakePair(lp);
            address token0 = pair.token0();
            address token1 = pair.token1();
            if (token0 == WBNB || token1 == WBNB) {
                address token = token0 == WBNB ? token1 : token0;
                uint256 swapValue = amount / 2;
                uint256 tokenAmount = _swapBNBForToken(token, swapValue, address(this));
                _approveTokenIfNeeded(token);
                pair.skim(address(this));
                ROUTER.addLiquidityETH{value: amount - swapValue}(token, tokenAmount, 0, 0, receiver, block.timestamp);
            } else {
                uint256 swapValue = amount / 2;
                uint256 token0Amount = _swapBNBForToken(token0, swapValue, address(this));
                uint256 token1Amount = _swapBNBForToken(token1, amount - swapValue, address(this));
                _approveTokenIfNeeded(token0);
                _approveTokenIfNeeded(token1);
                pair.skim(address(this));
                ROUTER.addLiquidity(token0, token1, token0Amount, token1Amount, 0, 0, receiver, block.timestamp);
            }
        }
    }

    function _swapBNBForToken(
        address token,
        uint256 amount,
        address receiver
    ) private returns (uint256) {
        address[] memory path;
        path = new address[](2);
        path[0] = WBNB;
        path[1] = token;

        uint256[] memory amounts = ROUTER.swapExactETHForTokens{value: amount}(0, path, receiver, block.timestamp);
        return amounts[amounts.length - 1];
    }

    function _swapTokenForBNB(
        address token,
        uint256 amount,
        address receiver
    ) private returns (uint256) {
        address[] memory path;
        path = new address[](2);
        path[0] = token;
        path[1] = WBNB;

        uint256[] memory amounts = ROUTER.swapExactTokensForETH(amount, 0, path, receiver, block.timestamp);
        return amounts[amounts.length - 1];
    }

    function _swap(
        address from,
        uint256 amount,
        address to,
        address receiver
    ) private returns (uint256) {
        address[] memory path;
        if (from == WBNB || to == WBNB) {
            path = new address[](2);
            path[0] = from;
            path[1] = to;
        } else {
            path = new address[](3);
            path[0] = from;
            path[1] = WBNB;
            path[2] = to;
        }

        uint256[] memory amounts = ROUTER.swapExactTokensForTokens(amount, 0, path, to, block.timestamp);
        return amounts[amounts.length - 1];
    }

    function _safeSwapToBNB(uint256 amount) private returns (uint256) {
        require(IERC20(WBNB).balanceOf(address(this)) >= amount, "Not enough WBNB balance.");
        uint256 beforeBNB = address(this).balance;

        IERC20(WBNB).transferFrom(msg.sender, address(this), amount);
        IWETH(WBNB).withdraw(amount);
        (bool success, ) = msg.sender.call{value: amount}(new bytes(0));
        require(success, "! safe transfer bnb");

        return address(this).balance - beforeBNB;
    }

    //******************************* view ********************************/
    function isLP(address token) public view override returns (bool) {
        return !notLPToken[token];
    }

    //*************************** admin *********************************** */
    function setNotLP(address token) public onlyOwner {
        require(token != address(0), "Invalid address.");
        if (notLPToken[token] == false) {
            tokens.push(token);
        }
        notLPToken[token] = true;
    }

    function removeToken(uint256 index) public onlyOwner {
        address token = tokens[index];
        notLPToken[token] = false;
        tokens[index] = tokens[tokens.length - 1];
        tokens.pop();
    }

    function cleanLeft() public onlyOwner {
        for (uint256 i = 0; i < tokens.length; i++) {
            address token = tokens[i];
            if (token == address(0)) continue;
            uint256 amount = IERC20(token).balanceOf(address(this));
            if (amount > 0) {
                _swapTokenForBNB(token, amount, kakiFoundation);
            }
        }
    }

    function setFoundation(address newFoundation) public onlyOwner {
        require(newFoundation != address(0), "Invalid foundation address");
        kakiFoundation = newFoundation;
    }
}

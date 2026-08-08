// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title InkVaultAI
 * @notice Enterprise-grade UUPS upgradeable vault with AI execution security, ERC20 support, and linear vesting for Ink.
 */
contract InkVaultAI is 
    Initializable, 
    UUPSUpgradeable, 
    OwnableUpgradeable, 
    PausableUpgradeable 
{
    using SafeERC20 for IERC20;

    // --- Reentrancy Guard Storage ---
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    address public tradingBot;
    uint256 public maxTradeLimit;

    struct LinearVesting {
        uint256 totalAmount;
        uint256 amountClaimed;
        uint256 startTime;
        uint256 duration;
    }

    mapping(address => LinearVesting) public userVestings;
    mapping(address => bool) public whitelistedTargets;

    event PaymentProcessed(address indexed to, uint256 amount, address token);
    event TradeExecuted(address indexed target, uint256 amount);
    event TargetWhitelisted(address indexed target, bool status);
    event VestingSet(address indexed beneficiary, uint256 amount, uint256 startTime, uint256 duration);
    event VestingClaimed(address indexed beneficiary, uint256 amount);
    event EmergencyWithdrawn(address indexed owner, uint256 amount, address token);

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __Pausable_init();
        
        _status = _NOT_ENTERED;
        maxTradeLimit = 10 ether;
    }

    // --- Access & Security Settings ---

    function setTradingBot(address _bot) external onlyOwner {
        require(_bot != address(0), "Invalid bot address");
        tradingBot = _bot;
    }

    function setMaxTradeLimit(uint256 _limit) external onlyOwner {
        maxTradeLimit = _limit;
    }

    function setWhitelistedTarget(address _target, bool _whitelistedStatus) external onlyOwner {
        require(_target != address(0), "Invalid target");
        whitelistedTargets[_target] = _whitelistedStatus;
        emit TargetWhitelisted(_target, _whitelistedStatus);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // --- Trade Execution Layer (AI / Bot) ---

    function executeTrade(
        address target, 
        bytes calldata data, 
        uint256 value
    ) external payable nonReentrant whenNotPaused {
        require(msg.sender == tradingBot, "Unauthorized: Only AI Bot");
        require(whitelistedTargets[target], "Target not whitelisted");
        require(value <= maxTradeLimit, "Trade value exceeds limit");

        (bool success, ) = target.call{value: value}(data);
        require(success, "Trade execution failed");
        
        emit TradeExecuted(target, value);
    }

    // --- Linear Vesting System ---

    function setLinearVesting(
        address beneficiary, 
        uint256 amount, 
        uint256 startTime, 
        uint256 duration
    ) external onlyOwner {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(duration > 0, "Duration must be > 0");

        userVestings[beneficiary] = LinearVesting({
            totalAmount: amount,
            amountClaimed: 0,
            startTime: startTime,
            duration: duration
        });

        emit VestingSet(beneficiary, amount, startTime, duration);
    }

    function claimVesting() external nonReentrant whenNotPaused {
        LinearVesting storage v = userVestings[msg.sender];
        require(v.totalAmount > 0, "No vesting schedule");

        uint256 vested = _calculateVestedAmount(v);
        uint256 claimable = vested - v.amountClaimed;
        require(claimable > 0, "Nothing to claim");

        v.amountClaimed += claimable;

        (bool success, ) = payable(msg.sender).call{value: claimable}("");
        require(success, "ETH Transfer failed");

        emit VestingClaimed(msg.sender, claimable);
    }

    function _calculateVestedAmount(LinearVesting memory v) internal view returns (uint256) {
        if (block.timestamp < v.startTime) {
            return 0;
        } else if (block.timestamp >= v.startTime + v.duration) {
            return v.totalAmount;
        } else {
            return (v.totalAmount * (block.timestamp - v.startTime)) / v.duration;
        }
    }

    // --- Payments & Emergency Controls ---

    function processPayment(address payable recipient, uint256 amount) external onlyOwner nonReentrant {
        require(address(this).balance >= amount, "Insufficient balance");
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Payment failed");
        emit PaymentProcessed(recipient, amount, address(0));
    }

    function processERC20Payment(address token, address recipient, uint256 amount) external onlyOwner nonReentrant {
        IERC20(token).safeTransfer(recipient, amount);
        emit PaymentProcessed(recipient, amount, token);
    }

    function emergencyWithdraw(address token, uint256 amount) external onlyOwner nonReentrant {
        if (token == address(0)) {
            (bool success, ) = payable(owner()).call{value: amount}("");
            require(success, "Emergency ETH withdraw failed");
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
        emit EmergencyWithdrawn(owner(), amount, token);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    receive() external payable {}
}
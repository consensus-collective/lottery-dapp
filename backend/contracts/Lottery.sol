// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Ownable} from   "@openzeppelin/contracts/access/Ownable.sol";
import {LotteryToken} from "./LotteryToken.sol";

contract Lottery is Ownable {
  /// @notice Address of the token used payment for bets
  LotteryToken public paymentToken;
  /// @notice Flag indication whether the lottery is open for bets or not
  bool public betsOpen;
  /// @notice Timestamp of the the lottert next closing date and time
  uint256 public betsClosingTime;

  constructor() {
    paymentToken = new LotteryToken("Lottery Token", "LTK");
  }

  /// @notice Passes when the lottery is at open state and the current block timestamp is  lower than the lottert close
  modifier whenBetsOpen() {
    require(betsOpen && block.timestamp < betsClosingTime, "Lottery: Lottery is closed");
    _;
  }

  /// @notice Passess when the lottery is at closed state
  modifier whenBetsClosed() {
    require(!betsOpen, "Lottery: Lottery is open");
    _;
  }

  /// @notice Opens the lottery for receiving bets
  function openBets(uint256 closingTime) external onlyOwner whenBetsClosed {
    require(closingTime > block.timestamp, "Lottery: Closing time must be in future");
    betsClosingTime = closingTime;
    betsOpen = true;
  }

  function purchaseTokens() external payable {

  }
}

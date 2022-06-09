// SPDX-License-Identifier: UNLICENCED

pragma solidity ^0.8.8;

import "./YetAnotherCoin.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @title A BNBT-Rinkeby blockchain bridge implementation for a sample
///        ERC20 token. 
/// @author Sfy Mantissa
contract Bridge {

  using Counters for Counters.Counter;
  using ECDSA for bytes32;

  /// @dev ERC20 token interface used.
  IYetAnotherCoin public token;

  /// @dev Initiating the bridge transaction counter.
  Counters.Counter public nonce;

  /// @dev Used to prevent nonce collisions.
  mapping(uint256 => bool) public nonceIsUsed;

  /// @dev Triggers both upon `swap` and `redeem`.
  event SwapInitialized (
    address sender,
    address recepient,
    uint256 amount,
    uint256 nonce,
    bool isRedeem
  );

  /// @dev YAC token address may be different for BNBT/Rinkeby networks, so
  ///      it's set in the constructor.
  constructor(address _tokenAddress) {
    token = IYetAnotherCoin(_tokenAddress);
  }

  /// @notice Start the swap and burn `_amount` of YAC tokens from
  ///         the caller's address.
  /// @param _recepient The recepient's address.
  /// @param _amount The quantity of tokens to be burned in the first network.
  function swap(address _recepient, uint256 _amount)
    external
  {
    token.burn(msg.sender, _amount);

    emit SwapInitialized(
      msg.sender,
      _recepient,
      _amount,
      nonce.current(),
      false
    );

    nonce.increment();
  }

  /// @notice End the swap and mint `_amount` of YAC tokens to the caller 
  ///         address, verifying the request with `_signature` and `_nounce`.
  /// @dev ECDSA library is used to check whether the transaction was signed
  ///      by the caller.
  /// @param _sender The sender's address.
  /// @param _signature Signed message hash.
  /// @param _amount The amount of YAC tokens to be transferred.
  /// @param _nonce Bridge operation counter value.
  function redeem(
    address _sender,
    bytes calldata _signature,
    uint256 _amount,
    uint256 _nonce
  ) 
    external
  {

    require(
      nonceIsUsed[_nonce] == false, 
      "ERROR: Nonce was used previously."
    );

    nonceIsUsed[_nonce] = true;

    bytes32 signature = keccak256(
      abi.encodePacked(
        _sender,
        msg.sender,
        address(this),
        _amount,
        _nonce
      )
    );

    require(
      ECDSA.recover(
        signature.toEthSignedMessageHash(),
        _signature
    ) == msg.sender,
      "ERROR: Signature is invalid."
    );

    token.mint(msg.sender, _amount);

    emit SwapInitialized(
      _sender,
      msg.sender,
      _amount,
      _nonce,
      true
    );
  }

} 

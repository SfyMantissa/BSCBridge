// SPDX-License-Identifier: UNLICENCED

pragma solidity ^0.8.8;

import "./YetAnotherCoin.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

/// @title A BNBT-Rinkeby blockchain bridge implementation for a sample
///        ERC20 token.
/// @author Sfy Mantissa
contract Bridge is EIP712, Ownable {
  using Counters for Counters.Counter;
  using ECDSA for bytes32;

  /// @dev ERC20 token interface used.
  IYetAnotherCoin public token;

  /// @dev Initiating the bridge transaction counter.
  Counters.Counter public nonce;

  /// @dev Commission percentage when swap amount >= 100 tokens.
  uint256 public commissionPercentage;

  /// @dev Comission absolute value when swap amount < 100 tokens.
  uint256 public lowCommission;

  /// @dev Used to prevent nonce collisions.
  mapping(uint256 => bool) public nonceIsUsed;

  /// @dev Typehash for EIP-712 compliant hashStruct.
  bytes32 public constant SWAP_TYPEHASH =
    keccak256(
      "Swap(address sender,address recipient,uint256 amount,uint256 nonce,bool isRedeem)"
    );

  /// @dev Type for hashStruct.
  struct SwapStruct {
    address sender;
    address recipient;
    uint256 amount;
    uint256 nonce;
    bool isRedeem;
  }

  /// @dev Triggers both upon `swap` and `redeem`.
  event Swap(
    address sender,
    address recipient,
    uint256 amount,
    uint256 nonce,
    bool isRedeem
  );

  /// @dev YAC token address may be different for BNBT/Rinkeby networks, so
  ///      it's set in the constructor.
  constructor(
    address _tokenAddress,
    uint256 _commissionPercentage,
    uint256 _lowCommission
  ) EIP712("BNBT/Rinkeby Bridge", "1.0") {
    token = IYetAnotherCoin(_tokenAddress);
    commissionPercentage = _commissionPercentage;
    lowCommission = _lowCommission;
  }

  /// @dev Change the commission percentage.
  ///      Can only be called by the owner.
  /// @param _commissionPercentage New commission percentage.
  function setCommissionPercentage(uint256 _commissionPercentage)
    external
    onlyOwner
  {
    commissionPercentage = _commissionPercentage;
  }

  /// @dev Change the the commission amount for swaps with < 100 tokens.
  ///      Can only be called by the owner.
  /// @param _lowCommission New commission amount.
  function setLowCommission(uint256 _lowCommission) external onlyOwner {
    lowCommission = _lowCommission;
  }

  /// @notice Start the swap and burn `_amount` of YAC tokens from
  ///         the caller's address.
  /// @param _recepient The recepient's address.
  /// @param _amount The quantity of tokens to be burned in the first network.
  function swap(address _recepient, uint256 _amount) external {
    token.burn(msg.sender, _amount);

    emit Swap(msg.sender, _recepient, _amount, nonce.current(), false);

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
  ) external {
    require(nonceIsUsed[_nonce] == false, "ERROR: Nonce was used previously.");
    nonceIsUsed[_nonce] = true;

    SwapStruct memory _swap = SwapStruct({
      sender: _sender,
      recipient: msg.sender,
      amount: _amount,
      nonce: _nonce,
      isRedeem: true
    });

    require(
      ECDSA.recover(_hash(_swap), _signature) == _sender,
      "ERROR: Signature is invalid."
    );

    uint256 commission = lowCommission;

    if (_amount >= 100) {
      commission = (_amount * commissionPercentage) / 100;
    }

    token.mint(address(this), _amount);
    token.transfer(msg.sender, _amount - commission);

    emit Swap(
      _swap.sender,
      _swap.recipient,
      _amount - commission,
      _swap.nonce,
      _swap.isRedeem
    );
  }

  function _hash(SwapStruct memory _swap) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            SWAP_TYPEHASH,
            _swap.sender,
            _swap.recipient,
            _swap.amount,
            _swap.nonce,
            _toUInt256(_swap.isRedeem)
          )
        )
      );
  }

  function _toUInt256(bool x) internal pure returns (uint256 r) {
    assembly {
      r := x
    }
  }
}

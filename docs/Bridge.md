# Bridge

*Sfy Mantissa*

> A BSC-ETH blockchain bridge implementation for         a sample ERC-20 token. 





## Methods

### nonce

```solidity
function nonce() external view returns (uint256 _value)
```



*Initiating the bridge transaction counter.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _value | uint256 | undefined |

### nonceIsUsed

```solidity
function nonceIsUsed(uint256) external view returns (bool)
```



*Used to prevent nonce collisions.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### redeem

```solidity
function redeem(bytes _signature, uint256 _amount, uint256 _nonce) external nonpayable
```

End the swap and mint `_amount` of YAC tokens to the caller          address, verifying the request with `_signature` and `_nounce`.

*ECDSA library is used to check whether the transaction was signed      by the caller.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _signature | bytes | Signed message hash. |
| _amount | uint256 | The amount of YAC tokens to be transferred. |
| _nonce | uint256 | Bridge operation counter value. |

### swap

```solidity
function swap(uint256 _amount) external nonpayable
```

Start the swap and burn `_amount` of YAC tokens from         the caller&#39;s address.



#### Parameters

| Name | Type | Description |
|---|---|---|
| _amount | uint256 | The quantity of tokens to be burned in the first network. |

### token

```solidity
function token() external view returns (contract IYetAnotherCoin)
```



*ERC-20 token interface used.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IYetAnotherCoin | undefined |



## Events

### SwapInitialized

```solidity
event SwapInitialized(address user, uint256 amount, uint256 nonce, bool isRedeem)
```



*Triggers both upon `swap` and `redeem`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| user  | address | undefined |
| amount  | uint256 | undefined |
| nonce  | uint256 | undefined |
| isRedeem  | bool | undefined |




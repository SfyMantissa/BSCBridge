# Bridge

*Sfy Mantissa*

> A BNBT-Rinkeby blockchain bridge implementation for a sample        ERC20 token.





## Methods

### SWAP_TYPEHASH

```solidity
function SWAP_TYPEHASH() external view returns (bytes32)
```



*Typehash for EIP-712 compliant hashStruct.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### commissionPercentage

```solidity
function commissionPercentage() external view returns (uint256)
```



*Commission percentage when swap amount &gt;= 100 tokens.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### lowCommission

```solidity
function lowCommission() external view returns (uint256)
```



*Comission absolute value when swap amount &lt; 100 tokens.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

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

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### redeem

```solidity
function redeem(address _sender, bytes _signature, uint256 _amount, uint256 _nonce) external nonpayable
```

End the swap and mint `_amount` of YAC tokens to the caller         address, verifying the request with `_signature` and `_nounce`.

*ECDSA library is used to check whether the transaction was signed      by the caller.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _sender | address | The sender&#39;s address. |
| _signature | bytes | Signed message hash. |
| _amount | uint256 | The amount of YAC tokens to be transferred. |
| _nonce | uint256 | Bridge operation counter value. |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### setCommissionPercentage

```solidity
function setCommissionPercentage(uint256 _commissionPercentage) external nonpayable
```



*Change the commission percentage.      Can only be called by the owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _commissionPercentage | uint256 | New commission percentage. |

### setLowCommission

```solidity
function setLowCommission(uint256 _lowCommission) external nonpayable
```



*Change the the commission amount for swaps with &lt; 100 tokens.      Can only be called by the owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _lowCommission | uint256 | New commission amount. |

### swap

```solidity
function swap(address _recepient, uint256 _amount) external nonpayable
```

Start the swap and burn `_amount` of YAC tokens from         the caller&#39;s address.



#### Parameters

| Name | Type | Description |
|---|---|---|
| _recepient | address | The recepient&#39;s address. |
| _amount | uint256 | The quantity of tokens to be burned in the first network. |

### token

```solidity
function token() external view returns (contract IYetAnotherCoin)
```



*ERC20 token interface used.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IYetAnotherCoin | undefined |

### totalCommissioned

```solidity
function totalCommissioned() external view returns (uint256)
```



*Total commissioned tokens stored on contract.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### withdraw

```solidity
function withdraw() external nonpayable
```








## Events

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### Swap

```solidity
event Swap(address sender, address recipient, uint256 amount, uint256 nonce, bool isRedeem)
```



*Triggers both upon `swap` and `redeem`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| sender  | address | undefined |
| recipient  | address | undefined |
| amount  | uint256 | undefined |
| nonce  | uint256 | undefined |
| isRedeem  | bool | undefined |

### Withdrawal

```solidity
event Withdrawal(address owner, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner  | address | undefined |
| amount  | uint256 | undefined |




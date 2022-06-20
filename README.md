# BNBT-Rinkeby ERC20 Token Bridge 🌉

A BNBT-Rinkeby blockchain bridge implementation for a sample ERC20 token. 

## Features

- [x] Uses ECDSA for signature verification in redeem().
- [x] All contracts are deployed to BNBT and Ethereum (Rinkeby) testnets and verified on Etherscan/BscScan:
  - [BNBT Bridge](https://testnet.bscscan.com/address/0x99E030cdfEd7117EC426ac360B2e907cB3c49328#code)
  - [Rinkeby Bridge](https://rinkeby.etherscan.io/address/0x25D90889A9B053090d01e6F6dE817EF5BA0291e3#code)
  - [YAC token (BNBT)](https://testnet.bscscan.com/address/0xf55aBB498A19Fe90B039BC30aAD11C2e9f71bab1#code)
  - [YAC token (Rinkeby)](https://rinkeby.etherscan.io/address/0xB069A157Ed653d91765eA1E8bAc5c18454A83Ba4#code)
- [x] Tests provide a 100% coverage in accordance with _solidity-coverage_.
- [x] Tasks for swap(), redeem(), and to fetch YAC token balances on each chain.
- [x] Contracts are 100% covered with NatSpec.
- [x] A comprehensive Markdown documentation is available in _docs/_.

## To do

- [x] Use EIP712-compliant signing.
- [ ] Use token pools instead of burn() and mint().
- [x] Take commissions for swaps.
- [x] Add sender and recipient.

## Usage

**IMPORTANT: all variable data needed to deploy/use/test the contract is stored in config.ts**

```
cat config.ts
const config = {
  BRIDGE_BNBT_ADDRESS: "0x99E030cdfEd7117EC426ac360B2e907cB3c49328",
  BRIDGE_RINKEBY_ADDRESS: "0x25D90889A9B053090d01e6F6dE817EF5BA0291e3",
  YAC_BNBT_ADDRESS: "0xf55aBB498A19Fe90B039BC30aAD11C2e9f71bab1",
  YAC_RINKEBY_ADDRESS: "0xB069A157Ed653d91765eA1E8bAc5c18454A83Ba4"
};

export default config;
```

0. Make sure that you have enough YAC tokens on the appropriate network using the _balanceOf_ task.
For better comprehension, here the swap will be from BNBT to Rinkeby (an order reversed compared to the one presented on the demo screenshot).

```
hh balanceOf --signer 0 --network bnbt
0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF has 100804 of YAC tokens on the BNBT chain.
```

Also check the Rinkeby balance so you can see the result in the end more clearly.

```
hh balanceOf --signer 0 --network rinkeby
0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF has 97760 of YAC tokens on the RINKEBY chain.
```

1. Let's try viewing and changing the commissions.

```
hh commissionPercentage --network rinkeby
Commission percentage is 1.

hh lowCommission --network rinkeby
Low commission is 0.

hh commissionPercentage --network bnbt
Commission percentage is 1.

hh lowCommission --network bnbt
Low commission is 0.
```

Commissions can be changed independently for RINKEBY → BNBT swaps and BNBT → RINKEBY swaps.
_lowCommission_ is set in absolute terms and applies to swaps with < 100 tokens.
_commissionPercentage_ is set in percents and applies to swaps with >= 100 tokens (**WARN: Solidity uses integer arithmetics**).
Commissions are computed on _redeem()_.
Commissions are stored on the smart contract and can be withdrawn later by the owner.

Let's try changing the commission for RINKEBY → BNBT swaps.

```
hh setCommissionPercentage --signer 0 --value 2 --network bnbt
Commission percentage changed from 1 to 2.

hh setLowCommission --signer 0 --value 1 --network bnbt
Low commission changed from 0 to 1.
```

So now for all RINKEBY → BNBT swaps with < 100 tokens the commission will be 1 token.
And for all swap with >= 100 tokens the commission will be 2% of the amount.

2. Initiate the swap using the _swap_ task.
Let's initiate 2 swaps: one with < 100 tokens and one with >= 100 tokens.

```
hh swap --signer 0 --recepient "0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF" --amount 60 --network rinkeby
Initiated the swap from RINKEBY of 60 YAC tokens by user 0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF to user 0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF.
Nonce is 3.

hh swap --signer 0 --recepient "0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF" --amount 700 --network rinkeby
Initiated the swap from RINKEBY of 700 YAC tokens by user 0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF to user 0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF.
Nonce is 4.
```

As we can see, our RINKEBY YAC balance decreased by 60 + 700 = 760.

```
hh balanceOf --signer 0 --network rinkeby
0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF has 97000 of YAC tokens on the RINKEBY chain.
```

3. Redeem the swapped assets using the _redeem_ task.
Make sure all the values (including the nonce) are correct, for otherwise signature check will fail.
As we can observe, in the first case the commission in exactly 1 YAC, while in the second case the commission is 14 YAC.

```
python -c "print(round(700 * 2 / 100))"
14
```

```
hh redeem --signer 0 --sender "0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF" --amount 60 --nonce 3 --network bnbt
Finished the swap to BNBT of 59 YAC tokens by user 0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF to user 0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF.
Nonce was 3.
Commission is 1 YAC token(s).

hh redeem --signer 0 --sender "0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF" --amount 700 --nonce 4 --network bnbt
Finished the swap to BNBT of 686 YAC tokens by user 0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF to user 0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF.
Nonce was 4.
Commission is 14 YAC token(s).
```

Now we check our BNBT YAC balance — it increased by 59 + 686 = 745. 
101549 - 100804 = 745, Hooray!

```
hh balanceOf --signer 0 --network bnbt
0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF has 101549 of YAC tokens on the BNBT chain.
```

3. Finally, as owner, you may withdraw the accumulated commission.
Here it would be: 1 + 14 = 15 YAC tokens.

```
hh withdraw --signer 0 --network bnbt
Owner 0x9271EfD9709270334721f58f722DDc5C8Ee0E3DF has withdrawn 15 YAC tokens commissioned by users from the contract.
```

Repeat as many times as you'd like to :)

P.S. _hh_ is an alias for _npx hardhat_.

## Demonstation

![](demo/tests.png)

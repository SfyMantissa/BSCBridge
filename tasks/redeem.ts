import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../config';

task("redeem",
  "Redeem ERC20 tokens sent from either ETH or BSC.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("sender", "The sender's address.")
  .addParam("amount", "The amount of ERC20 tokens to be swapped.")
  .addParam("nonce", "Bridge operation counter value.")
  .setAction(async (args, { ethers }) => {

    let bridgeAddress: string;
    const network = await ethers.provider.getNetwork();
    const signerArray = await ethers.getSigners();

    if (network.chainId === 4) {
      bridgeAddress = config.BRIDGE_RINKEBY_ADDRESS;
    } else if (network.chainId === 97) {
      bridgeAddress = config.BRIDGE_BNBT_ADDRESS;
    } else {
      throw "ERROR: Network must be Rinkeby or BNBT."
    }

    const domain = {
      name: "BNBT/Rinkeby Bridge",
      version: "1.0",
      chainId: network.chainId,
      verifyingContract: bridgeAddress
    };

    const types = {
      Swap: [
        { name: "sender", type: "address" },
        { name: "recipient", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "nonce", type: "uint256" },
      ],
    };

    const value = {
      sender: args.sender,
      recipient: signerArray[args.signer].address,
      amount: args.amount,
      nonce: args.nonce
    };

    let signature = await signerArray[args.signer]._signTypedData(domain, types, value);

    const Bridge = await ethers.getContractFactory("Bridge");
    const bridge = Bridge.attach(bridgeAddress);

    const txRedeem = bridge.connect(signerArray[args.signer]).redeem(
      args.sender,
      signature,
      args.amount,
      args.nonce
    );

    const rRedeem = await (await txRedeem).wait();

    const sender = rRedeem.events[2].args[0];
    const recepient = rRedeem.events[2].args[1];
    const amount = rRedeem.events[2].args[2];
    const nonce = rRedeem.events[2].args[3];
    const commission = rRedeem.events[2].args[4];

    console.log("Finished the swap to " + network.name.toUpperCase() + " of "
      + amount + " YAC tokens by user " + sender + " to user " + recepient
      + ".\n" + "Nonce was " + nonce + ".\n" + "Commission is " + commission
      + " YAC token(s).");

  });

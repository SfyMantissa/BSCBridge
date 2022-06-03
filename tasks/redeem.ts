import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../config';

task("redeem",
  "Redeem ERC20 tokens sent from either ETH or BSC.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("amount", "The amount of ERC20 tokens to be swapped.")
  .addParam("nonce", "Bridge operation counter value.")
  .addParam("blockchain", "Blockchain (ETH or BSC).")
  .setAction(async (args, { ethers }) => {
    let blockchain: string;
    let log: string;

    if (args.blockchain === "ETH") {
      blockchain = config.BRIDGE_ETH_ADDRESS;
      log = "BSC → ETH";
    } else if (args.blockchain === "BSC") {
      blockchain = config.BRIDGE_BSC_ADDRESS;
      log = "ETH → BSC";
    } else {
      throw "ERROR: Blockchain must be ETH or BSC."
    }

    const signerArray = await ethers.getSigners();

    const Bridge = await ethers.getContractFactory("Bridge");
    const bridge = Bridge.attach(blockchain);

    let messageHash = ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint256"],
      [signerArray[args.signer].address, blockchain,
      args.amount, args.nonce]
    );

    let signature = await signerArray[args.signer].signMessage(
      ethers.utils.arrayify(messageHash)
    );

    const txRedeem = bridge.connect(signerArray[args.signer]).redeem(
      signature,
      args.amount,
      args.nonce
    );

    const rRedeem = await (await txRedeem).wait();

    const user = rRedeem.events[1].args[0];
    const amount = rRedeem.events[1].args[1];
    const nonce = rRedeem.events[1].args[2];

    console.log("Finished the swap " + log + " of " + amount
      + " YAC tokens by user " + user + ".\n" + "Nonce was "
      + nonce + ".");

  });

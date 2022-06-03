import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../config';

task("swap",
  "Initiate the swap of ERC20 token between 2 blockchains.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("amount", "The amount of ERC20 tokens to be swapped.")
  .addParam("blockchain", "Blockchain (ETH or BSC).")
  .setAction(async (args, { ethers }) => {
    let blockchain: string;
    let log: string;

    if (args.blockchain === "ETH") {
      blockchain = config.BRIDGE_ETH_ADDRESS;
      log = "ETH → BSC";
    } else if (args.blockchain === "BSC") {
      blockchain = config.BRIDGE_BSC_ADDRESS;
      log = "BSC → ETH";
    } else {
      throw "ERROR: Blockchain must be ETH or BSC."
    }

    const signerArray = await ethers.getSigners();

    const Bridge = await ethers.getContractFactory("Bridge");
    const bridge = Bridge.attach(blockchain);

    const txSwap = bridge.connect(signerArray[args.signer]).swap(
      args.amount
    );

    const rSwap = await (await txSwap).wait();

    const user = rSwap.events[1].args[0];
    const amount = rSwap.events[1].args[1];
    const nonce = rSwap.events[1].args[2];

    console.log("Initiated the swap " + log + " of " + amount
      + " YAC tokens by user " + user + ".\n" + "Nonce is " + nonce + ".");

  });

import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../config';

task("balanceOf",
  "Get the balance YAC of the account in the ETH/BSC networks.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("blockchain", "Blockchain (ETH or BSC).")
  .setAction(async (args, { ethers }) => {

    let blockchain: string;

    if (args.blockchain === "ETH") {
      blockchain = config.YAC_ETH_ADDRESS;
    } else if (args.blockchain === "BSC") {
      blockchain = config.YAC_BSC_ADDRESS;
    } else {
      throw "ERROR: Blockchain must be ETH or BSC."
    }

    const signerArray = await ethers.getSigners();

    const YetAnotherCoin = await ethers.getContractFactory("YetAnotherCoin");
    const yetAnotherCoin = YetAnotherCoin.attach(blockchain);
    const balanceOf = await yetAnotherCoin.balanceOf(
      signerArray[args.signer].address
    );
    console.log(signerArray[args.signer].address + " has " + balanceOf
      + " of YAC tokens on the " + args.blockchain + " chain.");
  });


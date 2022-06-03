import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../config';

task("balanceOf",
  "Get the balance YAC of the account in the ETH/BSC networks.")
  .addParam("signer", "ID of the signer used to make the call.")
  .setAction(async (args, { ethers }) => {

    let tokenAddress: string;
    const network = await ethers.provider.getNetwork();
    const signerArray = await ethers.getSigners();

    if (network.chainId === 4) {
      tokenAddress = config.YAC_RINKEBY_ADDRESS;
    } else if (network.chainId === 97) {
      tokenAddress = config.YAC_BNBT_ADDRESS;
    } else {
      throw "ERROR: Network must be Rinkeby or BNBT."
    }

    const YetAnotherCoin = await ethers.getContractFactory("YetAnotherCoin");
    const yetAnotherCoin = YetAnotherCoin.attach(tokenAddress);
    const balanceOf = await yetAnotherCoin.balanceOf(
      signerArray[args.signer].address
    );

    console.log(signerArray[args.signer].address + " has " + balanceOf
      + " of YAC tokens on the " + network.name.toUpperCase() + " chain.");
  });


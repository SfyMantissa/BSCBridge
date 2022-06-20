import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../config';

task("setCommissionPercentage",
  "Set the commission percentage.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("value", "The new commission percentage value.")
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

    const Bridge = await ethers.getContractFactory("Bridge");
    const bridge = Bridge.attach(bridgeAddress);
    const commissionPercentage = await bridge.commissionPercentage();
    await bridge.connect(signerArray[args.signer]).setCommissionPercentage(args.value);
    const newCommissionPercentage = await bridge.commissionPercentage();
    console.log("Commission percentage changed from " + commissionPercentage
      + " to " + newCommissionPercentage + '.');
  });

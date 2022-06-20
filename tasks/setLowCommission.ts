import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../config';

task("setLowCommission",
  "Set the low commission.")
  .addParam("signer", "ID of the signer used to make the call.")
  .addParam("value", "The new low commission value.")
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
    const lowCommission = await bridge.lowCommission();
    await bridge.connect(signerArray[args.signer]).setLowCommission(args.value);
    const newLowCommission = await bridge.lowCommission();
    console.log("Low commission changed from " + lowCommission
      + " to " + newLowCommission + '.');
  });

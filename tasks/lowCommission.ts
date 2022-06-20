import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../config';

task("lowCommission",
  "Get the current low commission.")
  .setAction(async (_, { ethers }) => {
    let bridgeAddress: string;
    const network = await ethers.provider.getNetwork();

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
    console.log("Low commission is " + lowCommission + '.');
  });

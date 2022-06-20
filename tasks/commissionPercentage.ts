import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from '../config';

task("commissionPercentage",
  "Get the current commssion percentage.")
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
    const commissionPercentage = await bridge.commissionPercentage();
    console.log("Commission percentage is " + commissionPercentage + '.');
  });

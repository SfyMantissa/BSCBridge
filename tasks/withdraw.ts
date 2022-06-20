import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import config from "../config";

task("withdraw", "Withdraw all the commissioned tokens.")
  .addParam("signer", "ID of the signer used to make the call.")
  .setAction(async (args, { ethers }) => {
    let bridgeAddress: string;
    const network = await ethers.provider.getNetwork();
    const signerArray = await ethers.getSigners();

    if (network.chainId === 4) {
      bridgeAddress = config.BRIDGE_RINKEBY_ADDRESS;
    } else if (network.chainId === 97) {
      bridgeAddress = config.BRIDGE_BNBT_ADDRESS;
    } else {
      throw "ERROR: Network must be Rinkeby or BNBT.";
    }

    const Bridge = await ethers.getContractFactory("Bridge");
    const bridge = Bridge.attach(bridgeAddress);

    const txWithdraw = bridge.connect(signerArray[args.signer]).withdraw();
    const rWithdraw = await (await txWithdraw).wait();

    const owner = rWithdraw.events[1].args[0];
    const totalCommissioned = rWithdraw.events[1].args[1];

    console.log(
      "Owner " +
      owner +
      " has withdrawn " +
      totalCommissioned +
      " YAC tokens commissioned by users from the contract."
    );
  });

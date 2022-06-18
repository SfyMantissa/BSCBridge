import { expect } from "chai";
import { ethers } from "hardhat";
const hre = require("hardhat");
import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import config from "../config";

describe("Bridge", () => {
  let bridge: Contract;
  let yetAnotherCoin: Contract;
  let owner: SignerWithAddress;

  before(async () => {
    [owner] = await ethers.getSigners();

    const Bridge = await ethers.getContractFactory("Bridge");
    bridge = await Bridge.deploy(config.YAC_RINKEBY_ADDRESS);
    await bridge.deployed();

    const YetAnotherCoin = await ethers.getContractFactory("YetAnotherCoin");
    yetAnotherCoin = YetAnotherCoin.attach(config.YAC_RINKEBY_ADDRESS);
  });

  it("swap: should be able to initiate the swap of 10 YAC tokens", async () => {
    await yetAnotherCoin.connect(owner).mint(owner.address, 1000);

    await expect(bridge.connect(owner).swap(owner.address, 10))
      .to.emit(bridge, "SwapInitialized")
      .withArgs(owner.address, owner.address, 10, 0, false);
    expect(
      await yetAnotherCoin.connect(owner).balanceOf(owner.address)
    ).to.equal(990);
  });

  it("redeem: should successfully redeem 10 YAC with nonce given the correct signature", async () => {
    let messageHash = ethers.utils.solidityKeccak256(
      ["address", "address", "address", "uint256", "uint256"],
      [owner.address, owner.address, bridge.address, 10, 0]
    );

    let signature = await owner.signMessage(ethers.utils.arrayify(messageHash));

    await expect(bridge.connect(owner).redeem(owner.address, signature, 10, 0))
      .to.emit(bridge, "SwapInitialized")
      .withArgs(owner.address, owner.address, 10, 0, true);
    expect(
      await yetAnotherCoin.connect(owner).balanceOf(owner.address)
    ).to.equal(1000);
  });

  it("redeem: should revert given previously used nonce", async () => {
    let messageHash = ethers.utils.solidityKeccak256(
      ["address", "address", "address", "uint256", "uint256"],
      [owner.address, owner.address, bridge.address, 10, 0]
    );

    let signature = await owner.signMessage(ethers.utils.arrayify(messageHash));

    await expect(
      bridge.connect(owner).redeem(owner.address, signature, 10, 0)
    ).to.be.revertedWith("ERROR: Nonce was used previously.");
  });

  it("redeem: should revert given an invalid signature", async () => {
    let messageHash = ethers.utils.solidityKeccak256(
      ["address", "address", "address", "uint256", "uint256"],
      [owner.address, owner.address, bridge.address, 10, 3]
    );

    let signature = await owner.signMessage(ethers.utils.arrayify(messageHash));

    await expect(
      bridge.connect(owner).redeem(owner.address, signature, 10, 2)
    ).to.be.revertedWith("ERROR: Signature is invalid.");
  });
});

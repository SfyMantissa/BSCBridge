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
  let domain: any;
  let types: any;
  let value: any;

  before(async () => {
    [owner] = await ethers.getSigners();

    const Bridge = await ethers.getContractFactory("Bridge");
    bridge = await Bridge.deploy(config.YAC_RINKEBY_ADDRESS);
    await bridge.deployed();

    const YetAnotherCoin = await ethers.getContractFactory("YetAnotherCoin");
    yetAnotherCoin = YetAnotherCoin.attach(config.YAC_RINKEBY_ADDRESS);

    domain = {
      name: "BNBT/Rinkeby Bridge",
      version: "1.0",
      chainId: 31337,
      verifyingContract: bridge.address,
    };

    types = {
      Swap: [
        { name: "sender", type: "address" },
        { name: "recipient", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "isRedeem", type: "bool" },
      ],
    };
  });

  it("swap: should be able to initiate the swap of 10 YAC tokens", async () => {
    await yetAnotherCoin.connect(owner).mint(owner.address, 1000);

    await expect(bridge.connect(owner).swap(owner.address, 10))
      .to.emit(bridge, "Swap")
      .withArgs(owner.address, owner.address, 10, 0, false);
    expect(
      await yetAnotherCoin.connect(owner).balanceOf(owner.address)
    ).to.equal(990);
  });

  it("redeem: should successfully redeem 10 YAC with nonce given the correct signature", async () => {
    value = {
      sender: owner.address,
      recipient: owner.address,
      amount: 10,
      nonce: 0,
      isRedeem: true,
    };

    let signature = await owner._signTypedData(domain, types, value);

    await expect(
      bridge
        .connect(owner)
        .redeem(value.sender, signature, value.amount, value.nonce)
    )
      .to.emit(bridge, "Swap")
      .withArgs(
        value.sender,
        owner.address,
        value.amount,
        value.nonce,
        value.isRedeem
      );

    expect(
      await yetAnotherCoin.connect(owner).balanceOf(owner.address)
    ).to.equal(1000);
  });

  it("redeem: should revert given previously used nonce", async () => {
    let signature = await owner._signTypedData(domain, types, value);

    await expect(
      bridge
        .connect(owner)
        .redeem(value.sender, signature, value.amount, value.nonce)
    ).to.be.revertedWith("ERROR: Nonce was used previously.");
  });

  it("redeem: should revert given an invalid signature", async () => {
    value = {
      sender: owner.address,
      recipient: owner.address,
      amount: 11,
      nonce: 1,
      isRedeem: true,
    };

    let signature = await owner._signTypedData(domain, types, value);

    await expect(
      bridge.connect(owner).redeem(value.sender, signature, 10, value.nonce)
    ).to.be.revertedWith("ERROR: Signature is invalid.");
  });
});

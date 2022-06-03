import * as fs from 'fs';
import { ethers } from "hardhat";
import config from '../config';

const updateDeploymentAddress = async (address: string) => {
  let config: string = './config.ts';
  fs.readFile(config, 'utf-8', (err: unknown, data: string) => {
    if (err) throw err;
    let regex = /BRIDGE_BNBT_ADDRESS: ".*",/g;
    let update = data.replace(
      regex,
      'BRIDGE_BNBT_ADDRESS: "' + address + '",'
    );

    fs.writeFile(config, update, 'utf-8', (err: unknown) => {
      if (err) throw err;
      console.log('Updated BRIDGE_BNBT_ADDRESS in config.ts.');
    });
  });
};

const main = async () => {
  const Bridge = await ethers.getContractFactory("Bridge");
  const bridge = await Bridge.deploy(
    config.YAC_BNBT_ADDRESS
  );
  await bridge.deployed();
  console.log("Bridge deployed to:", bridge.address);
  updateDeploymentAddress(bridge.address);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


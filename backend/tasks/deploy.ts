import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployArgument } from "../interfaces";
import { getParams } from "../helpers";

export async function deploy(
  args: DeployArgument,
  hre: HardhatRuntimeEnvironment,
) {
  const { run, ethers, network } = hre;
  const { name } = args;

  try {
    await run("compile");

    const params = await getParams(hre, args);

    const [deployer] = await ethers.getSigners();

    console.log("\nNetwork:", network.name);
    console.log("Deployer:", deployer.address);
    console.log("Params:", params);

    const factory = await ethers.getContractFactory(name, deployer);

    console.log("\nDeploying", name.toLowerCase(), "contract...");

    const contract = await factory.deploy(...params);

    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();

    console.log("Contract is deployed at", contractAddress);

    return { contract, address: contractAddress, params };
  } catch (err) {
    console.log(err);
  }
}

export async function deployAndVerify(
  args: DeployArgument,
  hre: HardhatRuntimeEnvironment,
) {
  try {
    const { run } = hre;
    const { name } = args;
    const { contract, address, params } = await run("deploy", args);

    console.log("Waiting for block confirmations...");

    await contract?.deploymentTransaction()?.wait(5);

    console.log("Confirmed!\n");

    console.log("Verifying", name.toLowerCase(), "contract...");

    await hre.run("verify:verify", {
      address: address,
      contract: `contracts/${name}.sol:${name}`,
      constructorArguments: params,
    });
  } catch (err) {
    console.log(err);
  }
}

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployArgument } from "../interfaces";

export async function getParams(
  hre: HardhatRuntimeEnvironment,
  args: DeployArgument,
): Promise<string[]> {
  const params = args.params;

  /*
    Custom function for processing the parameters 
    before deploying contract
  */

  return Object.values(params);
}

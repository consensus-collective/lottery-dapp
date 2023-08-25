import { task, types } from "hardhat/config";
import { accounts } from "./accounts";
import { deploy, deployAndVerify } from "./deploy";

task("accounts", "Get list of avalaible accounts").setAction(accounts);

task("deploy", "Deploys a contract")
  .addOptionalParam("name", "Contract name", "", types.string)
  .addOptionalParam("params", "Contract parameters", {}, types.json)
  .setAction(deploy);

task("deploy-and-verify", "Deploys and verifies a contract")
  .addOptionalParam("name", "Contract name", "", types.string)
  .addOptionalParam("params", "Contract parameters", {}, types.json)
  .setAction(deployAndVerify);

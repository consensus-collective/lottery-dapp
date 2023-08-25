# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
yarn hardhat help
yarn hardhat test
yarn hardhat node
```

## Scripts

1. List available network
    `yarn hardhat accounts [--network]`

demo: 
```bash
$ yarn hardhat accounts --network sepolia
Available accounts:
- 0x33Cb9c62131915C86DFfCb5C853379865Ae7379d
- 0xD22C7a03d8a7f55916A1DF0ae3840B82B46216ae
- 0x47fd2c10B62716348fc4E4052f870930946C0a19

```

2. Deploy
    `yarn hardhat deploy [--name] [--params] [--network]`

demo:
```bash
$ yarn hardhat deploy --name Lock --params '{"unlockTime": "1692718617670"}' --network sepolia

Network: sepolia
Deployer: 0x33Cb9c62131915C86DFfCb5C853379865Ae7379d
Params: [ '1692718617670' ]

Deploying lock contract...
Contract is deployed at 0x0C0e6F6D76000A3bb5BBc351a48C73be3b978E00

```

3. Deploy and Verify
    `yarn hardhat deploy-and-verify [--name] [--params] [--network]`

demo:
```bash
$ yarn hardhat deploy-and-verify --name Lock --params '{"unlockTime": "1692718617670"}' --network sepolia

Network: sepolia
Deployer: 0x33Cb9c62131915C86DFfCb5C853379865Ae7379d
Params: [ '1692718617670' ]

Deploying lock contract...
Contract is deployed at 0xb32E73b726A0e21A32d48bF4Cf76dc668A073DC3
Waiting for block confirmations...
Confirmed!

Verifying lock contract...
The contract 0xb32E73b726A0e21A32d48bF4Cf76dc668A073DC3 has already been verified.
https://sepolia.etherscan.io/address/0xb32E73b726A0e21A32d48bF4Cf76dc668A073DC3#code

```

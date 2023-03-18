## Anablocc Solidity SmartContract

This is a hardhat project to test and deploy anablocc app on evm based network. [Front End Repository : https://github.com/Sahajpal/ANA-BLOCC-Frontend](https://github.com/Sahajpal/ANA-BLOCC-Frontend)

### Setup

#### Running Locally

Install Node and NPM

- Node v14.0.0 or higher
  - NPM v6.14.4 or higher

Install required packages

`npm install`

### Hardhat

- `npx hardhat --help` or `npx hardhat help` to find all commands.
- Helpful Hardhat links
  - [Hardhat Documentation](https://hardhat.org/getting-started/)
  - [Hardhat Error Codes](https://hardhat.org/errors/)
  - [Hardhat Plugins](https://hardhat.org/plugins/)

#### Compilation

`npx hardhat compile`

- Creates two folders (if not created already).
  - Cache and Artifacts
- Artifacts will have a folder called 'Contracts' and other folders.
  - Other folders will be of libraries.
  - 'Contracts' folder will contain all Solidity files' Artifact and Debug files.
    - <--example-contract-->.json and <--example-contract-->.dbg.json
- In hardhat.config.js,
  - Solidity version given should be equal to solidity versions that can be used by the contracts.
  - If multiple solidity versions are required, they can be set
    - ```
        solidity: {
            compilers: [
            {
              version: "0.5.5",
            },
            {
              version: "0.6.7",
              settings: {},
            },
            ],
        }
      ```
  - Compilation can be optimised based on type of contract
    - ```
        solidity: {
          version: "0.5.15",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        }
      ```
- More info can be found in the official documentation's [compiling-contracts](https://hardhat.org/guides/compile-contracts.html) section.

#### Deployment

`npx hardhat run scripts/deploy.js --network <--network-->`
Or
`npm run deploy_testnet` for all of the deployment in order

- Hardhat compiles your project everytime before you deploy.
- `<--network-->` is configured to take one of 3 values
  - `localhost`
    - Deploys on your local hardhat node only if node is running (more on this later)
  - `maticmum`
    - Deploys on Polygon's Mumbai Testnet
  - No value if it needs to be deployed locally on hardhat.
- More info can be found in the official documentation's [deploying](https://hardhat.org/guides/deploying.html) section.

#### Testing

`npx hardhat test`
'test' directory contains the tests.

#### Local Node

`npx hardhat node`

- Local Ethereum Network node running at http://127.0.0.1:8545/
- 10 Accounts are created with 10000 ETH in each
- HD Wallet with fixed seed phrase for all
- Node can be set to mine blocks instantly or periodically
  - Also can mine blocks with transactions that have the highest gas fees

`npx hardhat node --fork`

- Fork from mainnet
- `blockNumber` can be set in hardhat.config.js to fork from a particular block.

### Environment Variables

- Create a .env file in the root of the directory
- Check .env.example to find required variables and set accordingly

### Blockchain configuaration

- Add/update the network with appropriate Alchemy url in hardhat.config.js

require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.1",
    settings: {
      optimizer: {
        //enabled: true,
        //runs: 1000,
      },
    },
  },
  defaultNetwork: "maticmum",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {},
    maticmum: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/X8etsjjTV51JdxYbZx82Atvue-NW6cc9',
      accounts: ['0x082b3d222cc32be16e52c14784a8cc0569522f9bd5035d00d546cd7ac1001197'],
    },
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

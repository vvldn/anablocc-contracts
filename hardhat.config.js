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
      accounts: ['0x589971200bed51cbff84c5b122b92313a753a916d62663e5549ab866f51096ac'],
    },
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

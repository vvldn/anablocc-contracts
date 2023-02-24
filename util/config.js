const fs = require("fs");
const config = {};

const findContractInfo = async () => {
  const contractFile = fs.readFileSync("./contract_details.json");
  const contractFileData = JSON.parse(contractFile);
  config.certContract = contractFileData.certContract;
  config.adminPrivateKey = process.env.PRIVATE_KEY;
};

findContractInfo();

module.exports = config;

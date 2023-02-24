/*

For Reference
const hre = require("hardhat");
const config = require("../util/config");
let deployedContract;
const getDeployedContract = async () => {
  deployedContract = await hre.ethers.getContractAt(
    "CertApp",
    config.certContract
  );
};
const addIssuer = async (issuerAddress, issuerName) => {
  try {
    if (!deployedContract) await getDeployedContract();
    const tx = await deployedContract.addIssuer(issuerAddress, issuerName);
    return process.env.POLYGON_SCAN_URL + tx.hash;
  } catch (err) {
    console.debug(`Error: ${JSON.stringify(err)}`);
  }
};
const isValidIssuer = async (isserAddress) => {
  try {
    if (!deployedContract) await getDeployedContract();
    const res = await deployedContract.validateIssuer(isserAddress);
    return res;
  } catch (err) {
    console.debug(err);
  }
};

module.exports = {
  addIssuer,
  isValidIssuer,
};
*/

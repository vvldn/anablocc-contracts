/*
For Reference
const { ethers } = require("hardhat");
const hre = require("hardhat");
const config = require("../util/config");
let deployedContract;


const getDeployedContract = async (issuerPrivateKey) => {
  const provider = new hre.ethers.providers.AlchemyProvider(
    "maticmum",
    process.env.ALCHEMY_API_KEY
  );
  const wallet = new hre.ethers.Wallet(issuerPrivateKey, provider);

  const contractFactory = await hre.ethers.getContractFactory("CertApp");
  const connectedContract = contractFactory.connect(wallet);
  deployedContract = connectedContract.attach(config.certContract);
};

const issueCertificate = async (
  certHash,
  certNumber,
  expiry,
  issuerPrivateKey
) => {
  try {
    if (!deployedContract) await getDeployedContract(issuerPrivateKey);
    certHash = `0x${certHash}`;
    const tx = await deployedContract.addCertificate(
      certHash,
      certNumber,
      expiry
    );

    return process.env.POLYGON_SCAN_URL + tx.hash;
  } catch (err) {
    console.debug(`Error: ${JSON.stringify(err)}`);
  }
};

const viewCertificate = async (
  issuerAddress,
  certNumber,
  certHash,
  issuerPrivateKey
) => {
  try {
    certHash = `0x${certHash}`;
    if (!deployedContract) await getDeployedContract(issuerPrivateKey);
    const result = await deployedContract.viewCertificate(
      issuerAddress,
      certNumber,
      certHash
    );
    return result;
  } catch (err) {
    console.debug(`Error: ${JSON.stringify(err)}`);
  }
};

const validateCertificate = async (
  issuerAddress,
  certNumber,
  certHash,
  issuerPrivateKey
) => {
  try {
    if (!deployedContract) await getDeployedContract(issuerPrivateKey);
    const result = await deployedContract.validateCertificate(
      issuerAddress,
      certNumber,
      certHash
    );
    return result;
  } catch (err) {
    console.debug(`Error: ${JSON.stringify(err)}`);
  }
};

const revokeCertificate = async (
  issuerPrivateKey,
  certNumber,
  revokeReason
) => {
  try {
    if (!deployedContract) await getDeployedContract(issuerPrivateKey);
    console.debug(certNumber, revokeReason);
    console.debug("Foo");
    const tx = await deployedContract.revokeCertificate(
      certNumber,
      revokeReason
    );
    return process.env.POLYGON_SCAN_URL + tx.hash;
  } catch (err) {
    console.debug("Error : " + err);
  }
};
module.exports = {
  viewCertificate,
  validateCertificate,
  issueCertificate,
  revokeCertificate,
};
*/
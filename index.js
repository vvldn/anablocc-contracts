/*#!/usr/bin/env node
const pdfUtil = require("./util/pdfUtil");
const adminUtil = require("./scripts/adminUtil");
const issuerUtil = require("./scripts/issuerUtil");
const { ethers } = require("hardhat");

const { check } = require("yargs");
const yargs = require("yargs");
console.log = function () {};
const getFullkey = (key) => `0x${key}`;
const issueCertificateToBlockchain = async (
  issuerName,
  issuerAddress,
  issuerPrivateKey,
  certificateNumber,
  certificateFileName,
  expiry
) => {
  const isValidIssuer = await adminUtil.isValidIssuer(issuerAddress);
  if (!isValidIssuer) return "Invalid issuer";
  if (!expiry) expiry = 3 * 30 * 24 * 60 * 60;
  await pdfUtil.issueCertificate(
    issuerName,
    issuerAddress,
    certificateNumber,
    certificateFileName
  );
  const certHash = await pdfUtil.getFileHash("Signed_" + certificateFileName);

  const transactionResult = await issuerUtil.issueCertificate(
    certHash,
    certificateNumber,
    expiry,
    issuerPrivateKey
  );
  return transactionResult;
};
const viewCertificate = async (certificateFileName) => {
  const pdfDocument = await pdfUtil.openFileAsPDFDocument(certificateFileName);
  const authorInfo = await pdfUtil.getCertificateInfo(pdfDocument);
  const certHash = await pdfUtil.getFileHash(certificateFileName);
  const { issuerAddress, certificateNumber } = authorInfo;
  const result = await issuerUtil.viewCertificate(
    issuerAddress,
    certificateNumber,
    certHash,
    process.env.PRIVATE_KEY
  );
  return result;
};

const revokeCertificate = async (issuerPrivateKey, file, reason) => {
  try {
    const pdfDocument = await pdfUtil.openFileAsPDFDocument(file);
    const authorInfo = await pdfUtil.getCertificateInfo(pdfDocument);
    const { issuerAddress, certificateNumber } = authorInfo;
    console.debug(issuerPrivateKey, certificateNumber, reason);
    const res = await issuerUtil.revokeCertificate(
      issuerPrivateKey,
      certificateNumber,
      reason
    );
    return res;
  } catch (err) {
    console.debug("Err : " + err);
  }
};

const options = yargs
  .usage("Usage: -n <name>")
  .command(
    "addIssuer",
    "Adds a new issuer in admin mode",
    (yargs) => {
      console.debug("Adding issuer...");
    },
    async (argv) => {
      if (!argv.name || !argv.pubkey) {
        console.debug("Please provide issuer public key and issuer name");
        return;
      }
      try {
        const res = await adminUtil.addIssuer(
          getFullkey(argv.pubkey),
          argv.name
        );

        console.debug("Issuer added: " + argv.name + " " + argv.pubkey);
        console.debug("View transaction here: " + res);
      } catch (err) {
        console.debug("Failed adding issuer");
      }
    }
  )
  .command(
    "verifyCertificate",
    "verify a certificate",
    (yargs) => {
      console.debug("verifying certificate");
    },
    async (argv) => {
      if (!argv.file) {
        console.debug("Please provide certificate file name");
        return;
      }
      try {
        const res = await viewCertificate(argv.file);
        console.debug("Status for " + argv.file + ": " + res);
      } catch (err) {
        console.debug(err);
      }
    }
  )
  .command(
    "addCertificate",
    "add a new certificate",
    (yargs) => {
      console.debug("Adding a new certificate...");
    },
    async (argv) => {
      if (
        !argv.file ||
        !argv.pubkey ||
        !argv.privatekey ||
        !argv.certnum ||
        !argv.name
      ) {
        console.debug(
          "Please provide certificate name, issuer public key, issuer private key and certificate number"
        );
        return;
      }
      try {
        const res = await issueCertificateToBlockchain(
          argv.name,
          getFullkey(argv.pubkey),
          getFullkey(argv.privatekey),
          argv.certnum,
          argv.file
        );

        console.debug("Certificate added: Signed_" + argv.file);
        console.debug("View transaction here: " + res);
      } catch (err) {
        console.log("Error: " + err);
      }
    }
  )
  .command(
    "revokeCertificate",
    "Revoke existing certificate",
    (yargs) => {
      console.debug("Revoking Certificate...");
    },
    async (argv) => {
      if (!argv.reason || !argv.file || !argv.privateKey) {
        console.debug("Please provide certificate id, privateKey and reason");
        return;
      }
      try {
        const res = await revokeCertificate(
          getFullkey(argv.privateKey),
          argv.file,
          argv.reason
        );
        console.debug("Certificate revoked:" + argv.file);
        console.debug("View transaction here: " + res);
      } catch (err) {
        console.debug("Error : " + err);
      }
    }
  ).argv;

/*
async function main() {
  const issuerAddress = "0x0D2A6a0bBe2bAa3390F61966c66f2C22A196E448";
  const issuerPrivateKey =
    "4d6b080d27a4aea05c934aac1c94f0eab3a7fcb67664efd5cfc0ec8fefaaf2da";
  const certificateNumber = "12348";
  const certificateName = "sslc2.pdf";
  //const res = await viewCertificate("Signed_sslc.pdf", issuerPrivateKey);
  //await addIssuer("IIT B", issuerAddress);
  const url = await issueCertificateToBlockchain(
    "IIT B",
    issuerAddress,
    issuerPrivateKey,
    certificateNumber,
    certificateName
  );
  console.log(url);
  //console.log(await pdfUtil.getFileHash("Signed_sslc.pdf"));
}

main();
*/

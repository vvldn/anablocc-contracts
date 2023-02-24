/*

For Reference
const { expect } = require("chai");
const { ethers } = require("hardhat");

var certContract;
var admin, issuer, validator;
const certHash =
  "0xd283f3979d00cb5493f2da07819695bc299fba34aa6e0bacb484fe07a2fc0ae0";
const dayInMinutes = 24 * 60;

describe("Contract must be deployed", async function () {
  it("contract deployment", async function () {
    [admin, issuer, validator] = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory("CertApp");
    certContract = await contractFactory.connect(admin).deploy();
  });
  it("Add an issuer", async function () {
    const tx = await certContract
      .connect(admin)
      .addIssuer(issuer.address, "Issuer");
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });
  it("Add certificate by issuer", async function () {
    const tx = await certContract
      .connect(issuer)
      .addCertificate(certHash, 001, dayInMinutes);
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });
  it("Invalid issuer cannot issue certificate", async function () {
    const createFailingCert = async () => {
      const tx = await certContract
        .connect(validator)
        .addCertificate(certHash, 002, Date.now + dayInMinutes);
    };

    expect(createFailingCert).to.throw;
  });

  it("Validator should be able to validate certificate", async function () {
    const tx = await certContract
      .connect(validator)
      .validateCertificate(issuer.address, 001, certHash);
    expect(tx).to.equal(true);
  });
  it("Issuer should be able to revoke certificate", async function () {
    const tx = await certContract
      .connect(issuer)
      .revokeCertificate(001, "Testing Revoke Certificate");
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1);
  });
  it("Revoked Certificate must show that certificate is revoked", async function () {
    const tx = await certContract
      .connect(validator)
      .viewCertificate(issuer.address, 001, certHash);
    expect(tx).to.equal("Testing Revoke Certificate");
  });
  it("Expired Certificate must show that certificate is expired", async function () {
    // I have no idea how to test this one.
  });
});
*/

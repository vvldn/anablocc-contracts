const hre = require("hardhat");
const fs = require("fs");
async function main() {
  try {
    const loContractFactory = await hre.ethers.getContractFactory("LandOwnership");
    const loContract = await loContractFactory.deploy();
    console.log("Land Ownership Contract Deployed");
    const contracts = {
      loContract: loContract.address,
    };
    let data = JSON.stringify(contracts);
    fs.writeFileSync("contract_details.json", data);
  } catch (err) {
    console.log(err);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const mongoose = require('mongoose');
const crypto = require("crypto");
const _ = require("underscore");
const hre = require("hardhat");

const userModel = require('../models/userModel');
const ownershipModel = require('../models/ownershipModel');
const { ownershipStatusEnum } = require("../enums");
const config = require('../config/config');

const getCoordinateHash = (lat, lng) => {
  return crypto
    .createHash("sha256", "supersecret")
    .update(`${lat}${lng}`)
    .digest("hex");
};

const generateGrid = (origin, widthX, widthY) => {
  const { x, y } = origin;
  const centerDistX = widthX / 2;
  const centerDistY = widthY / 2;
  const plot1 = {
    pixels: [
      { lat: x + centerDistX, lng: y + centerDistY * 3 },
      {
        lat: x + centerDistX,
        lng: y + centerDistY * 5,
      },
    ],
    layout: [
      { lat: x, lng: y + widthY },
      { lat: x + widthX , lng: y + widthY },
      { lat: x + widthX , lng: y + 3 * widthY },
      { lat: x, lng: y + 3 * widthY },
    ],
  };
  const plot2 = {
    pixels: [
      { lat: x + centerDistX * 3, lng: y + centerDistY },
    ],
    layout: [
      { lat: x + widthX , lng: y },
      { lat: x + 2 * widthX, lng: y },
      { lat: x + 2 * widthX , lng: y + widthY},
      { lat: x + widthX , lng: y + widthY},
    ],
  };
  const plot3 = {
    pixels: [
      {
        lat: x + centerDistX * 3,
        lng: y + centerDistY* 3,
      },
      {
        lat: x + centerDistX * 5,
        lng: y + centerDistY* 3,
      },
    ],
    layout: [
      { lat: x + widthX , lng: y + widthY },
      { lat: x + 3 * widthX , lng: y + widthY },
      { lat: x + 3 * widthX , lng: y + 2 * widthY },
      { lat: x + widthX , lng: y + 2 * widthY },
    ],
  };
  const plot4 = {
    pixels: [
      {
        lat: x + centerDistX * 3,
        lng: y + centerDistY * 5,
      },
    ],
    layout: [
      { lat: x + widthX , lng: y + 2 * widthY },
      { lat: x + 2 * widthX , lng: y + 2 * widthY },
      { lat: x + 2 * widthX , lng: y + 3 * widthY },
      { lat: x + widthX , lng: y + 3 * widthY },
    ],
  };
  const plot5 = {
    pixels: [
      { lat: x + centerDistX, lng: y + centerDistY * 7 },
      { lat: x + 3 * centerDistX, lng: y + centerDistY * 7 },
      { lat: x + 5 * centerDistX, lng: y + centerDistY * 7 },
      { lat: x + 5 * centerDistX, lng: y + centerDistY * 5 },
    ],
    layout: [
      { lat: x, lng: y + 3 * widthY },
      { lat: x + 2 * widthX , lng: y + 3 * widthY },
      { lat: x + 2 * widthX , lng: y + 2 * widthY },
      { lat: x + 3 * widthX , lng: y + 2 * widthY },
      { lat: x + 3 * widthX , lng: y + 4 * widthY },
      { lat: x, lng: y + 4 * widthY },
    ],
  };
  const plot6 = {
    pixels: [
      { lat: x + centerDistX * 7, lng: y + centerDistY * 7 },
      { lat: x + centerDistX * 7, lng: y + centerDistY * 5 },
      { lat: x + centerDistX * 7, lng: y + centerDistY * 3 },
      { lat: x + centerDistX * 7, lng: y + centerDistY },
    ],
    layout: [
      { lat: x + 3 * widthX , lng: y },
      { lat: x + 4 * widthX , lng: y },
      { lat: x + 4 * widthX , lng: y + 4 * widthY },
      { lat: x + 3 * widthX , lng: y + 4 * widthY },
    ],
  };
  const plots = [plot1, plot2, plot3, plot4, plot5, plot6];
  const plotWithPixelHash = _.map(plots, (plot) => {
    const pixels = _.map(plot.pixels, (pixel) => {
      const { lat, lng } = pixel;
      const hash = getCoordinateHash(lat, lng);
      return { hash, lat, lng };
    });
    return { layout: plot.layout, pixels };
  });
  return plotWithPixelHash;
};

async function initiateSale(plot, user) {
    const loContractFactory = await hre.ethers.getContractFactory("LandOwnership");
    // const address = config.contractAddress;
    const loContract = loContractFactory.attach(config.contractAddress);
    const hashes = _.map(plot.pixels, pixel => `0x${pixel.hash}`);
    const result = await loContract.initiateSaleFromAdmin(hashes, user.walletAddress);
    const hash = result.hash;
    return new Promise((resolve, reject) => {
        loContract.on('InitiateSale', response => {
            resolve({ ownershipId: response.toNumber(), hash });
        });
    });
}

// const users = [
//   {
//     name: 'Vighnesh',
//     walletAddress: '0xF267735fd551a1dC341ac7a3227cACC312F7dfb7',
//     aadhar: '1234123412341234',
//     email: 'abcd@gmail.com',
//     phone: '9999888800',
//   },
//   {
//     name: 'Kartikey',
//     walletAddress: '0xA454a05d3989f55Ff2FC22052E61a6a1911209b0',
//     aadhar: '1234123412341235',
//     email: 'abce@gmail.com',
//     phone: '9999888801',
//   },
//   {
//     name: 'Vishal',
//     walletAddress: '0xe49B2820FA0B3a5f10b4Cb40F836A0E85dc6eaEf',
//     aadhar: '1234123412341236',
//     email: 'abcf@gmail.com',
//     phone: '9999888802',
//   },
//   {
//     name: 'Sahaj',
//     walletAddress: '0x1D24D985E3c225CFC9635788982642FF8fd6F56e',
//     aadhar: '1234123412341237',
//     email: 'abcg@gmail.com',
//     phone: '9999888803',
//   },
//   {
//     name: 'Danish',
//     walletAddress: '0x31003c02dCe06E06b3Ab962d23b3E54ee73E5688',
//     aadhar: '1234123412341238',
//     email: 'abch@gmail.com',
//     phone: '9999888804',
//   },
//   {
//     name: 'Abhigya',
//     walletAddress: '0x7A18a3E54e3DB679135f7165759D81fc0944Fb9d',
//     aadhar: '1234123412341239',
//     email: 'abci@gmail.com',
//     phone: '9999888805',
//   }
// ]

async function startMigration() {
    const widthX = 0.00009
    const widthY = 0.0001
    const origin = {
      x: 12.903202,
      y: 77.651972,
    };
    const plots = generateGrid(origin, widthX, widthY);

    const users = await userModel.find({});
    
    for (let i = 0; i < 6; i++) {
      try {
        const user = users[i];
        const hash = await initiateSale(plots[i], user);
        const { hash: transactionHash, ownershipId } = hash;

        const pixelsWithHash = _.map(plots[i].pixels, pixel => {
          const pixelHash = getCoordinateHash(pixel.lat, pixel.lng);
          return { hash: pixelHash, lat: pixel.lat, lng: pixel.lng };
        })

        const ownership = await ownershipModel.create({
          ownerId: config.adminUserId,
          buyerId: user._id,
          ownershipId,
          transactions: [ {hash: transactionHash, status: ownershipStatusEnum.SALE_INITIATED} ],
          property: {
            mapLayout: plots[i].layout,
            pixels: pixelsWithHash,
            address: {
              line: '619, 1st main road',
              locality: 'HSR Layout',
              city: 'HSR Layout',
              pincode: '560102',
              state: 'Karnataka'
            }
          }
        });
        console.log(JSON.stringify(ownership));
      } catch (err) {
        console.error(err)
      }
    }
}

// const checkData = async () => {
//     const loContractFactory = await hre.ethers.getContractFactory("LandOwnership");
//     const address = config.contractAddress;
//     const loContract = loContractFactory.attach(address);
//     const result = await loContract.getPixelHistory('0xdfcc071524492569ab3a389d590384096c8678ecbcde01a27d16b78389b2d1e6');
//     const response = await loContract.getOpenSales();
//     console.log(result);
// }

// connect to database
const connectToDatabase = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(config.mongoUri);
    console.log('Connected to mongodb');

    await startMigration();
  } catch (err) {
    console.error(`Err: ${JSON.stringify(err)}`);
  }
}
connectToDatabase();

// checkData();

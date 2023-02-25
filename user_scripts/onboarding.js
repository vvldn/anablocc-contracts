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
      {
        lat: x + centerDistX * 3,
        lng: y + centerDistY,
      },
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
    const address = '0xF880360550a419B66eFB1646f44699d5991ed32C';
    const loContract = loContractFactory.attach(address);
    const hashes = _.map(plot.pixels, pixel => `0x${pixel.hash}`);
    const result = await loContract.initiateSaleFromAdmin(hashes, user.walletAddress);
    const hash = result.hash;
    return new Promise((resolve, reject) => {
        loContract.on('InitiateSale', response => {
            resolve({ ownershipId: response.toNumber(), hash });
        });
    });
}

const users = [
  {
    name: 'Vighnesh',
    walletAddress: '0xF267735fd551a1dC341ac7a3227cACC312F7dfb7',
    aadhar: '1234123412341234',
    email: 'abcd@gmail.com',
    phone: '9999888800',
  },
  {
    name: 'Kartikey',
    walletAddress: '0xA454a05d3989f55Ff2FC22052E61a6a1911209b0',
    aadhar: '1234123412341235',
    email: 'abce@gmail.com',
    phone: '9999888801',
  },
  {
    name: 'Vishal',
    walletAddress: '0xe49B2820FA0B3a5f10b4Cb40F836A0E85dc6eaEf',
    aadhar: '1234123412341236',
    email: 'abce@gmail.com',
    phone: '9999888802',
  }
]

async function startMigration() {
    const widthX = 0.00009
    const widthY = 0.0001
    const origin = {
      x: 12.903202,
      y: 77.651972,
    };
    const plots = generateGrid(origin, widthX, widthY);

    const newUsers = await Promise.all(_.map(users, user => userModel.create(user)));
    const user = newUsers[1];
    const hash = await initiateSale(plots[3], user);
    const { hash: transactionHash, ownershipId } = hash;

    const ownership = await ownershipModel.create({
      ownerId: config.adminUserId,
      buyerId: user._id,
      ownershipId,
      transactions: [ {hash: transactionHash, status: ownershipStatusEnum.SALE_INITIATED} ],
      property: {
        mapLayout: plots[3].layout,
        pixels: plots[3].pixels,
        address: {
          line: '619, 1st main road',
          locality: 'HSR Layout',
          city: 'HSR Layout',
          pincode: '560102',
          state: 'Karnataka'
        }
      }
    })

    // backend.registerActions();
    console.log(JSON.stringify(ownership));
}

startMigration();


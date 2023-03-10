const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const { ownershipStatusEnum, documentsStatusEnum } = require('../enums')

const ownershipSchema = new mongoose.Schema({
  lastOwnerId: { type: ObjectId, ref: 'User' },
  amount: { type: Number },
  property: {
    pixels: [{
      hash: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }],
    mapLayout: [{
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }],
    images: [{
      url: {
        type: String,
        required: true
      },
      alt: String
    }],
    address: {
      line: String,
      locality: String,
      city: String,
      pincode: String,
      state: String
    }
  },
  ownerId: { type: ObjectId, ref: 'User', required: true },
  buyerId: { type: ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: Object.values(ownershipStatusEnum),
    default: ownershipStatusEnum.SALE_INITIATED,
  },
  ownershipId: { type: String, unique: true, required: true },
  documents: [{
    ipfsAddress: {
      type: String,
      required: true
    },
    verificationStatus: {
      type: String,
      enum: Object.values(documentsStatusEnum),
      default: documentsStatusEnum.VERIFICATION_PENDING,
    }
  }],
  transactions: [{
    hash: String,
    status: String
  }],
}, { createdAt: true, updatedAt: true });

const Ownership = mongoose.model('Ownership', ownershipSchema);

module.exports = Ownership;

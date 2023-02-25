const mongoose = require('mongoose');

const { ownershipStatusEnum, documentsStatusEnum } = require('../enums');

const actionSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ownershipStatusEnum),
    default: ownershipStatusEnum.SALE_INITIATED
  },
  documents: [{
    url: {
      type: String,
      required: true
    },
    verificationStatus: {
      type: String,
      enum: Object.values(documentsStatusEnum),
      default: documentsStatusEnum.VERIFICATION_PENDING,
    }
  }],
  transactionHashes: [{ 
    hash: { type: String, required: true }, 
    status: { type: String, enum: Object.values(ownershipStatusEnum), required: true } 
  }]
});

const Action = mongoose.model('Action', actionSchema);

module.exports = Action;

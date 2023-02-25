const mongoose = require('mongoose');

const { ownershipStatusEnum } = require('../enums')

const ownershipSchema = new mongoose.Schema({
  lastOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ownershipStatusEnum),
    default: ownershipStatusEnum.BASE,
  }
});

const Ownership = mongoose.model('Ownership', ownershipSchema);

module.exports = Ownership;

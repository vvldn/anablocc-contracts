const mongoose = require('mongoose');

const { propertyStateEnum } = require('../enums')

const propertySchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pixels: [{
    hash: {
      type: String,
      required: true,
      unique: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  }],
  state: {
    type: String,
    enum: Object.values(propertyStateEnum),
    default: propertyStateEnum.BASE
  },
  ownershipHistory: [{
    date: String,
    seller: String,
    buyer: String
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
  },
  documents: [{
    url: {
      type: String,
      required: true
    }
  }]
}, { createdAt: true, updatedAt: true });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;

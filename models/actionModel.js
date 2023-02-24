const mongoose = require('mongoose');

const statesEnum = require('../enums/stateEnum');

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
  state: {
    type: String,
    enum: Object.values(statesEnum),
    default: statesEnum.BASE
  },
});

const Action = mongoose.model('Action', actionSchema);

module.exports = Action;

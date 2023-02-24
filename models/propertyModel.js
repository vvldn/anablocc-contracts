const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pixels: [{
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  }],
  state: {
    type: String,
    enum: Object.values(statesEnum),
    default: statesEnum.BASE
  }
});

/*
    States = 
        BASE
        SALE_INITIATED
        SALE_ACCEPTED
        TX_INITIATED
        TX_ACK
        TX_DOC_UPLOADED
        CLOSED
    */

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;

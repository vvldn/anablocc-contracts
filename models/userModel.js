const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  aadhar: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  walletAddress: {
    type: String,
    unique: true,
    trim: true,
    sparse: true
  },
}, { createdAt: true },);

const User = mongoose.model('User', userSchema);

module.exports = User;

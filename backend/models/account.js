// models/Account.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Account schema
const accountSchema = new Schema({
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }  // Reference to User
});

// Create and export the Account model
const Account = mongoose.model('Account', accountSchema);
module.exports = Account;

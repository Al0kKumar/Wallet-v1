// models/History.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the History schema
const historySchema = new Schema({
  type: {
    type: String,
    enum: ['WALLET_TO_WALLET', 'BANK_TO_WALLET', 'WALLET_TO_BANK'],
    required: true
  },
  amount: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  sendername: { type: String },
  receivername: { type: String },
  bank: { type: String }
});

// Create and export the History model
const History = mongoose.model('History', historySchema);
module.exports = History;

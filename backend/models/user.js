// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, // Reference to Account
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'History' }]  // Reference to History
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;

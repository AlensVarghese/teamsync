// model > userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // userType: { type: String, required: true },
  resetPasswordToken: String,  // Token for resetting password
  resetPasswordExpires: Date,  // Expiry time for reset token
});


module.exports = mongoose.model('User', userSchema);
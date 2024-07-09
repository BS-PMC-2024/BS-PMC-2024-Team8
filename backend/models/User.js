const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  full_name: String,
  email: String,
  country: String,
  password: String,
  company: String,
  permission: String
});

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;

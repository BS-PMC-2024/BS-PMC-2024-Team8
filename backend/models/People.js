const mongoose = require('mongoose');

const PeopleSchema = new mongoose.Schema({
  Name: String,
  Mail: String,
  Debt: Number,
  Age: Number,
  City: String,
  Date: String,
  Phone: String,
  Messages: String,
  Discount : String,
  Communication: Object,
  file: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('People', PeopleSchema);

const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({
  cname: String,
  status: String,
  file: String,
  moneyC: String,
  peopleC: String,
  peopleR: String,
  date: String,
  discount: String,
  communication: Object,
  strategy: String,
  sector: String,
});

const Process = mongoose.model('Process', processSchema, 'processes');
module.exports = Process;

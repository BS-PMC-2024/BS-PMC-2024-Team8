const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  age: String,
  city: String,
  pid: String,
  cname: String,
  left: String,
  amount: String,
  discount: String,
  via: String
});

const Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');
module.exports = Transaction;

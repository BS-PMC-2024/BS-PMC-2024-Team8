const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../scripts/encryption');

const transactionSchema = new mongoose.Schema({
  name: String,
  id: String,
  age: String,
  city: String,
  pid: String,
  cname: String,
  debt: String,
  phone: String,
  discount: String,
  via: String,
  card_number: 
  {
    type: String,
    get: decrypt,
    set: encrypt
  },
  expiry_date: 
  {
    type: String,
    get: decrypt,
    set: encrypt
  },
  cvv:
  {
    type: String,
    get: decrypt,
    set: encrypt
  },
  date: String,
  amountPayments: String,
  file:  mongoose.Schema.Types.ObjectId,
});

const Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');
module.exports = Transaction;

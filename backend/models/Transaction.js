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
  card_number: String,
  expiry_date: String,
  cvv: String,
  date: String,
  amountPayments: String,
  conformationCode: String,
  file: mongoose.Schema.Types.ObjectId,
});

// Pre-save hook to encrypt fields before saving to the database
transactionSchema.pre('save', async function (next) {
  if (this.isModified('card_number')) {
    this.card_number = await encrypt(this.card_number);
  }
  if (this.isModified('expiry_date')) {
    this.expiry_date = await encrypt(this.expiry_date);
  }
  if (this.isModified('cvv')) {
    this.cvv = await encrypt(this.cvv);
  }
  next();
});

// Method to compare encrypted fields (useful if you need to compare them later)
transactionSchema.methods.compareCardNumber = async function (plainText) {
  return await decrypt(plainText, this.card_number);
};

transactionSchema.methods.compareExpiryDate = async function (plainText) {
  return await decrypt(plainText, this.expiry_date);
};

transactionSchema.methods.compareCVV = async function (plainText) {
  return await decrypt(plainText, this.cvv);
};

const Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');
module.exports = Transaction;

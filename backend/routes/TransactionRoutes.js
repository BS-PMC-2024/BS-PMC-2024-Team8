const express = require('express');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/alltransactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/transactions/:company', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const filteredTransactions = transactions.filter(transaction => transaction.cname === req.params.company);
    console.log('Filtered transactions:', filteredTransactions);
    res.status(200).json({ success: true, transactions: filteredTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

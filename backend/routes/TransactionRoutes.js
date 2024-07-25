const express = require('express');
const Transaction = require('../models/Transaction');
const { format } = require('date-fns');
const Process = require('../models/Process');

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
    res.status(200).json({ success: true, transactions: filteredTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.post('/addTransaction'), async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    newTransaction.date = format(new Date(), 'dd/MM/yyyy');
    await newTransaction.save();
    let process = await Process.find({ file: newTransaction.file }).exec();
    process.moneyC += newTransaction.debt;
    process.peopleC += 1;
    process.peopleR -= 1;
    if (process.peopleR === 0) {
      process.status = 'closed';
    }
    try {
      const response = await axios.put(
        `http://localhost:6500/Proceses/${editedProceses._id}`,
        process
      );
    } catch (error) {
      console.error("Error updating Process:", error);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = router;

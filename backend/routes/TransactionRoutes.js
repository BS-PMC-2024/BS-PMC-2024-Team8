const express = require('express');
const Transaction = require('../models/Transaction');
const { format } = require('date-fns');
const Process = require('../models/Process');
const router = express.Router();
const axios = require('axios');
const People = require('../models/People');
const { encrypt } = require('../scripts/encryption');

router.get("/alltransactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/transactions/:company", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const filteredTransactions = transactions.filter(
      (transaction) => transaction.cname === req.params.company
    );
    res.status(200).json({ success: true, transactions: filteredTransactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post('/addTransaction', async (req, res) => {
  try {
    console.log(req.body);
    const newTransaction = new Transaction(req.body);
    console.log(newTransaction);
    await newTransaction.save();
    
    let process = await Process.findOne({ file: newTransaction.file });
    console.log(process);
    if (process) {
      process.moneyC = (parseFloat(newTransaction.debt) + parseFloat(process.moneyC)).toString();
      process.peopleC = (parseInt(process.peopleC) + 1).toString();
      process.peopleR = (parseInt(process.peopleR) - 1).toString();
      if (parseInt(process.peopleR) === 0) {
        process.status = 'closed';
      }
      try {
        const response = await axios.put(
          `http://localhost:6500/Proceses/${process._id}`, 
          process
        );
        console.log('Process updated:', response.data);
      } catch (error) {
        console.error("Error updating Process:", error);
      }
      console.log(newTransaction);
      await People.findOneAndDelete({ file: newTransaction.file.toString(), Name: newTransaction.name });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

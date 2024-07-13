const express = require('express');
const Process = require('../models/Process');
const router = express.Router();

router.get('/allprocesses', async (req, res) => {
    try {
      console.log('Fetching processes')
      const processes = await Process.find();
      res.status(200).json({ success: true, processes });
    } catch (error) {
      console.error('Error fetching processes:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
  );

router.get('/allprocesses/:company', async (req, res) => {
    try {
      const processes = await Process.find();
      filteredProcesses = processes.filter(process => process.cname === req.params.company);
      res.status(200).json({ success: true, filteredProcesses });
    } catch (error) {
      console.error('Error fetching processes:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
  );
  
  module.exports = router;

const express = require('express');
const User = require('../models/User');
const router = express.Router();
const People = require('../models/People');
const Process = require('../models/Process');

router.get('/allusers', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({ success: true, users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
  );
  router.get('/clients/:company', async (req, res) => {
    const company = req.params.company;
    try {
      const processes = await Process.find({ cname: company });
      const files = processes.map(p => p.file); 
      const clients = await People.find({ file: { $in: files } });
      res.status(200).json({ success: true, clients });
    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  module.exports = router;

const express = require('express');
const User = require('../models/User');
const router = express.Router();

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
  router.get('/allusers/:company', async (req, res) => {
    try {
      const users = await User.find();
      filteredUsers = users.filter(user => user.company === req.params.company);
      res.status(200).json({ success: true, users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  module.exports = router;

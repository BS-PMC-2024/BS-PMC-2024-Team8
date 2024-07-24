const express = require('express');
const router = express.Router();
const User = require('../models/User');
// Handle login request
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email, password });
      if (user) {
        res.json({ success: true, message: 'Credentials found', data:user });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error checking credentials:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  // Handle user registration request
router.post('/register', async (req, res) => {
    const userData = req.body;
    userData.premission = "company";
  
    try {
      const newUser = new User(userData);
      await newUser.save();
      res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  // Endpoint to update user information
router.put('/user/:email', async (req, res) => {
    try {
      const email = req.params.email;
      const updatedUserData = req.body;
      const updatedUser = await User.findOneAndUpdate({ email }, updatedUserData, { new: true });
      if (updatedUser) {
        res.status(200).json({ success: true, user: updatedUser });
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  // Get user information
router.get('/:email', async (req, res) => {
    try {
      const email = req.params.email;
      const user = await User.findOne({ email });
      if (user) {
        res.status(200).json({ success: true, data: user });
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user information:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
// Endpoint to check permissions
router.post('/check-permission', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error('Error checking permission:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
module.exports = router;

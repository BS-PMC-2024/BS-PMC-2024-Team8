const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { encrypt, decrypt } = require("../scripts/encryption");
const bcrypt = require("bcrypt");

// Handle login request
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log("password + " + password);
    console.log("password user  + " + user.password);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (isMatch) {
        res.json({ success: true, message: "Credentials found", data: user });
      } else {
        res.status(400).json({ success: false, message: "Wrong Password" });
      }
    } else {
      res.status(400).json({ success: false, message: "User not found" });
    }

  } catch (error) {
    console.error("Error checking credentials:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Handle user registration request
router.post("/register", async (req, res) => {
  const userData = req.body;
  userData.premission = "company";
  console.log("password: " + userData.password);
  userData.password = await encrypt(userData.password);
  try {
    const newUser = new User(userData);
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.put("/user/byid/:_id", async (req, res) => {
  const _id = req.params._id;
  const updatedData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(_id, updatedData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user: updatedData });
  } catch (error) {
    console.error("Error updating User:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// Endpoint to update user information
router.put("/user/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const newpassword = req.body.password;
    const user = await User.findOne({ email });
    if (user) {
      // Update the user with the new data
      user["password"] = await encrypt(newpassword);
      const updatedUser = await user.save();

      res.status(200).json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
      }
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
  router.delete('/user/:email', async (req, res) => {
    try {
      const email = req.params.email;
      const user
        = await User.findOneAndDelete ({ email });
      if (user) {
        res.status(200).json({ success: true, user });
      }
      else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

// Get user information
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Endpoint to check permissions
router.post("/check-permission", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error checking permission:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
module.exports = router;

// Importing required modules
const mongoose = require("mongoose"); // MongoDB object modeling tool
const bodyParser = require("body-parser"); // Parse incoming request bodies
const cors = require("cors"); // Enable Cross-Origin Resource Sharing
const express = require("express"); // Fast, unopinionated, minimalist web framework for Node.js
const { ObjectId } = require("mongodb");

const app = express(); // Create an instance of the express application

app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB database
mongoose
  .connect(
    "mongodb+srv://ahkcht981:Ahkcht98@bstorec.5l8i8lk.mongodb.net/nicerDebt",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const userSchema = new mongoose.Schema({
  _id: ObjectId,
  full_name: String,
  email: String,
  country: String,
  password: String,
  company: String,
  premission: String,
});
// Define schema for processes
const processSchema = new mongoose.Schema({
  cname: String,
  status: String,
  file: String,
  moneyC: String,
  peopleC: String,
  peopleR: String,
  date: String,
});
const Process = mongoose.model("Process", processSchema, "processes");
// Define schema for processes
const transactionSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  age: String,
  city: String,
  pid: String,
  left: String,
  amount: String,
});
const Transaction = mongoose.model(
  "Transaction",
  processSchema,
  "transactions"
);
// Create User model
const User = mongoose.model("User", userSchema, "users");
app.get("/allusers", async (req, res) => {
  try {
    const { name } = req.query;
    let users;
    if (name) {
      users = await User.find({ full_name: new RegExp(name, 'i') }); // case-insensitive search
    } else {
      users = await User.find();
    }
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/*
try {
  const users = await User.find();
  res.status(200).json({ success: true, users });
} catch (error) {
  console.error("Error fetching users:", error);
  res.status(500).json({ success: false, message: "Server error" });
}*/

app.get("/allprocesses", async (req, res) => {
  try {
    const processes = await Process.find();
    res.status(200).json({ success: true, processes });
  } catch (error) {
    console.error("Error fetching processes:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.get("/alltransactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// Handle login request
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({
        success: true,
        message: "Credentials found",
        premission: user.premission,
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error checking credentials:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Handle user registration request
app.post("/register", async (req, res) => {
  const userData = req.body;
  userData.premission = "Company";

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

// Endpoint to update user information
app.put("/user/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const updatedUserData = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { email },
      updatedUserData,
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get user information
app.get("/:email", async (req, res) => {
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
app.post("/check-permission", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error checking permission:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Endpoint to delete a user by email
app.delete("/deleteuser/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;

    const result = await User.findOneAndDelete({ email: userEmail });
    if (result) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});


// Endpoint to delete a process by ID
app.delete("/deleteprocess/:id", async (req, res) => {
  try {
    const processId = req.params.id;

    const result = await Process.findOneAndDelete({ _id: processId });
    if (result) {
      res.status(200).json({ message: "Process deleted successfully" });
    } else {
      res.status(404).json({ message: "Process not found" });
    }
  } catch (error) {
    console.error("Error deleting process:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.put("/Proceses/:_id", async (req, res) => {
  const _id = req.params._id;
  const updatedData = req.body;

  try {
    const updatedProcess = await Process.findByIdAndUpdate(_id, updatedData, { new: true });
    if (!updatedProcess) {
      return res.status(404).json({ success: false, message: "Process not found" });
    }
    res.status(200).json({ success: true, process: updatedProcess });
  } catch (error) {
    console.error("Error updating process:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});




// Start the server
const PORT = 6500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

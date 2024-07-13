<<<<<<< HEAD
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const app = express();

app.use(bodyParser.json());
app.use(cors());

=======
// Importing required modules
const mongoose = require('mongoose'); // MongoDB object modeling tool
const bodyParser = require('body-parser'); // Parse incoming request bodies
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const express = require('express'); // Fast, unopinionated, minimalist web framework for Node.js

const app = express(); // Create an instance of the express application

app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB database
>>>>>>> 05862a92 (BSPMS248-13)
mongoose.connect('mongodb+srv://ahkcht981:Ahkcht98@bstorec.5l8i8lk.mongodb.net/nicerDebt', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

<<<<<<< HEAD
// Import routes
const userRoutes = require('./routes/userRoutes');
const processRoutes = require('./routes/processRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');

// Use routes without changing the base URL
app.use('/', userRoutes);
app.use('/', processRoutes);
app.use('/', transactionRoutes);
app.use('/', authRoutes);
=======
const userSchema = new mongoose.Schema({
  full_name: String,
  email: String,
  country: String,
  password: String,
  company: String,
  premission: String
});
// Define schema for processes
const processSchema = new mongoose.Schema({
  cname: String,
  status: String,
  file: String,
  moneyC: String,
  peopleC: String,
  peopleR: String,
  date: String
});
const Process = mongoose.model('Process', processSchema, 'processes');
// Define schema for processes
const transactionSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  age: String,
  city: String,
  pid: String,
  left: String,
  amount: String
});
const Transaction = mongoose.model('Transaction', processSchema, 'transactions');
// Create User model
const User = mongoose.model('User', userSchema, 'users');
app.get('/allusers', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
);

app.get('/allprocesses', async (req, res) => {
  try {
    const processes = await Process.find();
    res.status(200).json({ success: true, processes });
  } catch (error) {
    console.error('Error fetching processes:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
);
app.get('/alltransactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// Handle login request
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ success: true, message: 'Credentials found', premission: user.premission });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error checking credentials:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Handle user registration request
app.post('/register', async (req, res) => {
  const userData = req.body;
  userData.premission = "Company";

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
app.put('/user/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const updatedUserData = req.body;
    const updatedUser = await User.findOneAndUpdate({ email }, updatedUserData, { new: true });
    console.log('Updated user:', updatedUser);
    console.log('updatedUserData : ', updatedUserData);
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
app.get('/:email', async (req, res) => {
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
app.post('/check-permission', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error checking permission:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

>>>>>>> 05862a92 (BSPMS248-13)

// Start the server
const PORT = 6500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

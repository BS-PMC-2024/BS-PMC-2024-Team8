const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();
const { startScheduler } = require('./scripts/scheduler');

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://ahkcht981:Ahkcht98@bstorec.5l8i8lk.mongodb.net/nicerDebt', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async() => {
  console.log('Connected to MongoDB');
  //await authenticate(); 
  //startScheduler();
})
.catch(err => console.error('Error connecting to MongoDB:', err));

// Import routes
const userRoutes = require('./routes/UserRoutes');
const processRoutes = require('./routes/ProcessRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');

// Use routes without changing the base URL
app.use('/', userRoutes);
app.use('/', processRoutes);
app.use('/', transactionRoutes);
app.use('/', authRoutes);
require('./scripts/scheduler');

// Start the server
const PORT = 6500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const canteenRoutes = require('./routes/canteenRoutes'); // Add near the top

// ... your other app.use code ...


const app = express();

// 1. Middlewares
app.use(cors()); // Allows your React frontend to talk to this backend
app.use(express.json()); // Allows your server to understand JSON data
app.use('/api/canteens', canteenRoutes); // Hook it up!
// 2. A simple test route!
app.get('/', (req, res) => {
  res.send('Hello from the CreditSnap Backend Engine!');
});

// We will add more routes here later!

module.exports = app;
const express = require('express');
const cors = require('cors');

// Import both sets of routes safely!
const canteenRoutes = require('./routes/canteenRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const ordersRouter = require('./routes/ordersRoute');
const debtRoutes = require('./routes/debtRoutes'); // ⭐ NEW: Import your Debt Routes
const analyticsRoutes = require('./routes/analyticsRoutes'); // ⭐ NEW: Import Analytics Routes
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// 1. Middlewares
app.use(cors()); // Allows your React frontend to talk to this backend
app.use(express.json({ limit: '10mb' })); // Allows your server to understand JSON data
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 2. Hook up the routes!
app.use('/api/canteens', canteenRoutes); // Your work
app.use('/api/users', userRoutes);       // Your friend's work
app.use('/api/orders', ordersRouter);
app.use('/api/debts', debtRoutes);       // ⭐ NEW: Hook up the Debt API!
app.use('/api/analytics', analyticsRoutes); // ⭐ NEW: Hook up the Analytics API!
app.use('/api/payments', paymentRoutes);

// 3. A simple test route!
app.get('/', (req, res) => {
  res.send('Hello from the CreditSnap Backend Engine!');
});

module.exports = app;

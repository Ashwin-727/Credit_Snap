const express = require('express');
const userController = require('../controllers/userController');
const User = require('../models/userModel'); // 👈 YOU MUST ADD THIS LINE

const router = express.Router();

// Public Routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Protected Routes
router.get('/my-profile', userController.protect, userController.getMyProfile);

// Canteen List Route
router.get('/canteens', async (req, res) => {
  try {
    // This looks for any user with the role 'owner'
    const owners = await User.find({ role: 'owner' }).select('name status timings _id');
    
    res.status(200).json({
      status: 'success',
      results: owners.length,
      data: owners
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

module.exports = router;
const express = require('express');
const canteenController = require('../controllers/canteenController');

const router = express.Router();

// When React sends a POST request to this URL, add the item to the menu!
// The :canteenId acts as a variable so the backend knows WHICH canteen to update.
router.post('/:canteenId/menu', canteenController.addMenuItem);

module.exports = router;
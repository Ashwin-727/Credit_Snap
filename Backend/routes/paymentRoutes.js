const express = require('express');

const paymentController = require('../controllers/paymentController');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(userController.protect);

router.post('/debts/:debtId/create-order', paymentController.createDebtOrder);
router.post('/verify', paymentController.verifyDebtPayment);

module.exports = router;

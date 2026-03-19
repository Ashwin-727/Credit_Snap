const Order = require('../models/ordersModel');
const User = require('../models/userModel');
const Debt = require('../models/debtModel');

// 1. STUDENT: Place an order
// This is called when the student clicks "Place Debt Request" in React
exports.createOrder = async (req, res) => {
  try {
    const { canteenId, items, totalAmount } = req.body;

    const newOrder = await Order.create({
      student: req.user.id, // ID from the student's login token
      canteen: canteenId,   // ID of Hall 1 (69bc3ae4...)
      items,
      totalAmount
    });

    res.status(201).json({
      status: 'success',
      data: newOrder
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// 2. OWNER: View incoming orders
// This is called when the Owner (Hall 1) opens their dashboard
exports.getOwnerOrders = async (req, res) => {
  try {
    // We search for orders where 'canteen' matches the logged-in Owner's ID
    const orders = await Order.find({ canteen: req.user.id })
      .populate('student', 'name rollNo phone') // Fetches student details from User collection
      .sort('-createdAt'); // Newest orders at the top

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// 3. OWNER: Accept/Reject Order & Update Debt
// This is called when the Owner clicks "Accept" or "Reject"
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // logic: Only increase debt if the order is being ACCEPTED for the first time
    if (status === 'accepted' && order.status === 'pending') {
      const student = await User.findById(order.student);

      // Check if student is over their credit limit
      if (student.totalDebt + order.totalAmount > student.limit) {
        return res.status(400).json({ 
          status: 'fail', 
          message: 'Student credit limit exceeded!' 
        });
      }

      // Update Student's total debt in User Model
      await User.findByIdAndUpdate(order.student, { 
        $inc: { totalDebt: order.totalAmount } 
      });

      // Update Canteen-specific debt in Debt Model
      await Debt.findOneAndUpdate(
        { student: order.student, canteen: order.canteen },
        { $inc: { amountOwed: order.totalAmount } },
        { upsert: true }
      );
    }

    // Save the new status (accepted/rejected)
    order.status = status;
    await order.save();

    res.status(200).json({
      status: 'success',
      data: order
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// 4. STUDENT: View personal order history
exports.getStudentOrders = async (req, res) => {
  try {
    const orders = await Order.find({ student: req.user.id })
      .populate('canteen', 'name')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: orders
    });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error.message });
  }
};
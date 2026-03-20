const Debt = require('../models/debtModel');
const sendEmail = require('../utils/sendEmail'); 

// 📡 1. FETCH ACTIVE DEBTS (Loads the UI List)
exports.getActiveDebts = async (req, res) => {
  try {
    // Make sure the user requesting this is actually logged in and assigned to a canteen
    if (!req.user || !req.user.managedCanteen) {
      throw new Error('Not authorized to view this canteen\'s debts.');
    }

    const debts = await Debt.find({
      canteen: req.user.managedCanteen,
      amountOwed: { $gt: 0 } // Only fetch students who actually owe money
    }).populate('student', 'name email rollNo limit');

    res.status(200).json({ status: 'success', data: debts });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// 💰 2. DEDUCT DEBT LOGIC (Updates BOTH Debt ticket and User profile)
exports.payOffline = async (req, res) => {
  try {
    const amountPaid = Number(req.body.amountPaid);

    if (!amountPaid || isNaN(amountPaid) || amountPaid <= 0) {
      throw new Error('Please enter a valid numeric amount greater than zero.');
    }

    // ⭐ Notice we added .populate('student') here so we can edit the User too!
    const debt = await Debt.findById(req.params.id).populate('student');
    
    if (!debt) {
      throw new Error('Debt record not found!');
    }

    if (amountPaid > debt.amountOwed) {
      throw new Error(`Amount exceeds current debt! The maximum deduction is ₹${debt.amountOwed}.`);
    }

    // 1️⃣ Update the specific Canteen Debt Ticket
    debt.amountOwed = debt.amountOwed - amountPaid;
    await debt.save();

    // 2️⃣ Update the Student's overall totalDebt in the Users collection
    const student = debt.student; // We have the student data because of .populate()
    student.totalDebt = student.totalDebt - amountPaid;
    
    // Safety check so totalDebt never goes below 0
    if (student.totalDebt < 0) {
      student.totalDebt = 0; 
    }
    await student.save();

    res.status(200).json({
      status: 'success',
      message: `Successfully deducted ₹${amountPaid} from both Canteen and Student records.`,
      data: { 
        canteenDebt: debt.amountOwed,
        studentTotalDebt: student.totalDebt
      }
    });

  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// 🔔 3. NOTIFY STUDENT LOGIC (Using Nodemailer)
exports.notifyStudent = async (req, res) => {
  try {
    // 1. Fetch debt and populate both student and canteen
    const debt = await Debt.findById(req.params.id)
      .populate('student', 'name email')
      .populate('canteen', 'name'); 

    // 2. Strict safety check for the core records
    if (!debt || !debt.student) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'Debt or Student record not found in the database!' 
      });
    }

    // 3. Prevent sending emails for cleared debts
    if (debt.amountOwed === 0) {
      return res.status(400).json({ 
        status: 'fail', 
        message: `${debt.student.name} has no pending debt.` 
      });
    }

    // 4. THE FAIL-SAFE: Safely grab the Canteen Name
    const canteenName = debt.canteen && debt.canteen.name 
      ? debt.canteen.name 
      : "our canteen";

    // 5. Draft the email
    const emailMessage = `
      Hello ${debt.student.name},
      
      This is a friendly reminder from ${canteenName} regarding your Credit Snap account. 
      Your current pending total at our shop is ₹${debt.amountOwed}.
      
      Please clear this amount at your earliest convenience.
      
      Thanks,
      ${canteenName} & The Credit Snap Team
    `;

    // 6. Send the email
    await sendEmail({
      email: debt.student.email,
      subject: `Credit Snap: Pending Debt Reminder from ${canteenName}`, 
      message: emailMessage
    });

    res.status(200).json({
      status: 'success',
      message: `Notification sent to ${debt.student.name} from ${canteenName}`
    });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
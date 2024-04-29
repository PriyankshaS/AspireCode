// const LoanService = require("../services/LoanService");
const Loan = require("../models/Loan")
function LoanController() {

  // Customer can create loan
  const createLoan = async function(req, res) {
    const { amount, term } = req.body;
    // Generate scheduled repayments
    const repaymentAmount = amount / term;
    const currentDate = new Date();
    const scheduledRepayments = [];
    for (let i = 1; i <= term; i++) {
        const repaymentDate = new Date(currentDate);
        repaymentDate.setDate(repaymentDate.getDate() + (7 * i));
        scheduledRepayments.push({
            date: repaymentDate,
            amount: repaymentAmount.toFixed(2),
            status: 'PENDING'
        });
    }

    const loan = new Loan({
        amount,
        term,
        scheduledRepayments
    });
    try {
        await loan.save();
        res.status(201).json(loan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  };

  // Customer can view the loan assigned to him/her
  const viewLoan = async function(req, res) {
    const { id } = req.params;
    try {
        const loan = await Loan.findById(id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        res.status(200).json(loan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  };

  // Admin can approve the loan
  const approveLoan = async function(req, res) {
    const { id } = req.params;
    try {
        const loan = await Loan.findById(id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        loan.status = 'APPROVED';
        await loan.save();
        res.status(200).json(loan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  };

  // Customer add replayment
  const addRepayment = async function(req, res) {
    const { id } = req.params;
    const { amount } = req.body;
    try {
        const loan = await Loan.findById(id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        const scheduledRepayment = loan.scheduledRepayments.find(repayment => repayment.status === 'PENDING');
        if (!scheduledRepayment) {
            return res.status(400).json({ message: 'No pending repayments' });
        }
        if (parseFloat(amount) < parseFloat(scheduledRepayment.amount)) {
            return res.status(400).json({ message: 'Repayment amount should be greater or equal to scheduled amount' });
        }
        scheduledRepayment.status = 'PAID';
        await loan.save();
        const allRepaymentsPaid = loan.scheduledRepayments.every(repayment => repayment.status === 'PAID');
        if (allRepaymentsPaid) {
            loan.status = 'PAID';
            await loan.save();
        }
        res.status(201).json({ message: 'Repayment added successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  }

  return {
    list: viewLoan,
    create: createLoan,
    approve: approveLoan,
    repayment: addRepayment
  };
}

module.exports = LoanController();

const { ObjectID } = require("bson");
const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  term: {
    type: Number,
    required: true
  },
  scheduledRepayments: [{
    date: Date,
    amount: Number,
    status: { type: String, default: 'PENDING' }
  }],
  status: { type: String, default: 'PENDING' }
});

module.exports = mongoose.model("Loan", LoanSchema);

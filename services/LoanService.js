const Loan = require("../models/Loan");

function LoanService() {
  return {
    list: () => Loan.find(),
    add: data => new Loan(data).save(),
    update: id => Loan.findByIdAndUpdate(id)
  };
}

module.exports = LoanService();

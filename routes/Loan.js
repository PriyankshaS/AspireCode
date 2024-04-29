const express = require("express");
const router = express.Router();
const LoanController = require("../controller/LoanController");
const authenticateJWT = require("../middleware/Authenticate")

router.post("/add", authenticateJWT, LoanController.create);
router.patch('/:id/approve', authenticateJWT, LoanController.approve);
router.get("/:id", authenticateJWT, LoanController.list);
router.post("/:id/repayments", authenticateJWT, LoanController.repayment);


module.exports = router;

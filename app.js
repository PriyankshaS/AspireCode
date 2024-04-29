const express = require("express");
const app = express();
const BodyParser = require("body-parser");
const LoanRoutes = require("./routes/Loan");
const LoginRoutes = require("./routes/Login");
require('dotenv').config()

// parse application/json
app.use(BodyParser.json());

app.use("/api/loans", LoanRoutes);
app.use("/api/user", LoginRoutes);

 console.log(process.env.APP_SECRET)
module.exports = app;

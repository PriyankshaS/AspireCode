const mongoose = require("mongoose");

const serverURI = process.env.APP_DB || "mongodb://localhost:27017/mini-aspire";

class DBConnection {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(serverURI, { useNewUrlParser: true })
      .then(() => {
        console.log("DB connection successfull");
      })
      .catch(err => {
        console.error("DB connection error");
        console.log( err);
      });
  }
}

module.exports = new DBConnection();

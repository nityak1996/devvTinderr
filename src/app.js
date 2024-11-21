const express = require("express");
const connectDB = require("./config/database");
const app = express();

connectDB()
  .then(() => {
    console.log("Database connection is established...");
    app.listen(7777, () => {
      console.log("Server is successfully established");
    });
  })
  .catch((err) => {
    console.error("Database can not be conntected");
  });

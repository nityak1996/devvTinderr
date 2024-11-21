const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  //  Creating a new  instance of the User model
  const user = new User({
    firstName:"Loko",
    lastName: "Singh",
    emailId: "lokok1996@gmail.com",
    password: "loko@123",
  });
  await user.save();
  res.send("User Added Successfully")  
});

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

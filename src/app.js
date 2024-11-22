const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

// middleware express middileware which are used to read json format .
app.use(express.json());

app.post("/signup", async (req, res) => {
  //  Creating a new  instance of the User model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
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

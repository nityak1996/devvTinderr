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

// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  console.log(userEmail);
  try {
    const users = await User.findOne({ emailId: userEmail });
    if (!users) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Feed API - GET /feed- get all the users from the databse..
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
// delete the user from the database...
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // both way to find id for deleting..
    const user = await User.findByIdAndDelete({ _id: userId });
    // OR
    // const user = await User.findByIdAndDelete(userId);
    res.send("user Deleted Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Update data fo the user...
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  console.log(data);
  try {
   const user =  await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
    });
    // by default value "before " alaways...
    console.log(user)
    res.send("User Updated Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
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

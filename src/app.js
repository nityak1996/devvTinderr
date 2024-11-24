const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");

// middleware express middleware which are used to read json format .
app.use(express.json());
//middleware for cookies
app.use(cookieParser());
//middleware for auth.

app.post("/signup", async (req, res) => {
  try {
    //validate of data...
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //Encrypt the password...
    const passwordHash = await bcrypt.hash(password, 10); // 10 round is starndard salt that's why i using

    //  Creating a new  instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      return res.status(404).send("E invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Create a JWT Token
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790");
      console.log("toke is :" + token);

      // Add the token to cookie and send the response back to the user
      res.cookie("token", token);

      return res.send("Login Successful!!!");
    } else {
      return res.status(401).send("p invalid credentials");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

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
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATE = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATE.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    // this is api based validation
    // if (data.skills.length > 5) {
    //   throw new Error("Skills can't be more than 10");
    // }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    // by default value "before " alaways...
    console.log(user);
    res.send("User Updated Successfully");
  } catch (err) {
    res.status(400).send("Update Failed: " + err.message);
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
    console.error("Database can not be conntected :" + err.message);
  });

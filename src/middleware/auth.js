const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // Check if token exists
    if (!token) {
      return res.status(401).send("Please login");
    }

    // Verify the token
    const decodedObj = await jwt.verify(token, "DEV@Tinder$790");
    const { _id } = decodedObj;

    // Find the user by ID
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Attach the user object to the request
    req.user = user;

    // Proceed to the next middleware/route handler
    next();
  } catch (err) {
    // Handle any errors
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};

const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.send(` ${loggedInUser.firstName}, your profile updated successfully`);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});
profileRouter.patch("/profile/update-password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).send("Old and new passwords are required");
    }

    const loggedInUser = req.user; // Authenticated user from `userAuth`

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, loggedInUser.password);
    if (!isMatch) {
      return res.status(400).send("Old password is incorrect");
    }

    await loggedInUser.save();

    res.send(
      `${loggedInUser.firstName}, your password has been updated successfully`
    );
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});




module.exports = profileRouter;

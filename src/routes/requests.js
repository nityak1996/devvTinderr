const express = require("express")
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user;
    // sending a connection request
    console.log("Sending a connection request");
    res.send(user.firstName + "  has Connection request sent!");
  });
  



module.exports = requestRouter;
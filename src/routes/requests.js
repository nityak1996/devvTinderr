const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { connection } = require("mongoose");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
//   const user = req.user;
//   // sending a connection request
//   console.log("Sending a connection request");
//   res.send(user.firstName + "  has Connection request sent!");
// });

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "INVALID STATUS TYPE 😞:" + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User is not found" });
      }
      // if there is an existing ConnectionRequest
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        res
          .status(400)
          .send({ message: "Connection Request Already Existing 😞😞😞" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName + "is " + status + "to" + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);

module.exports = requestRouter;

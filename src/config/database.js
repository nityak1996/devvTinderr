const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://namastenode:ZN65k4OgsiRXRFwh@beingnode.k5hq9.mongodb.net/devTinder"
    );
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
  }
};

module.exports = connectDB;

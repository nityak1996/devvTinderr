const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://namastedev:GDDoYflrlzNRKH88@namastenode.zgj3y.mongodb.net/devTinder`"
    );
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
  }
};

module.exports = connectDB;

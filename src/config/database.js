const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastedev:GDDoYflrlzNRKH88@namastenode.zgj3y.mongodb.net/devTinder"
  );
};
module.exports = connectDB;

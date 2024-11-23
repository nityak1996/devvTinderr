const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password : " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/7790161?v=4",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url address: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user!!!",
    },
    // this is schema based validation !!!
    skills: {
      type: [String],
      validate: {
        validator: function (value) {
          if (value.length > 5) {
            throw new Error("You can't have more than 5 skills");
          }
        },
      },
    },
  },
  { timestamps: true }
);

// const User = mongoose.model("User",userSchema)
// module.exports = User

module.exports = mongoose.model("User", userSchema);

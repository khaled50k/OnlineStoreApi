const mongoose = require("mongoose");
const User = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      required: true,
    },
    status: {
      type: String,
      default: "active",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", User);

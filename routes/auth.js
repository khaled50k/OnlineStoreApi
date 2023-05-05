// Import necessary modules and middleware
const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const {
  getUserId,
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// Route to get user info using cookies
router.post("/", getUserId);

// Route to register a new user
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  const encryptedPassword = CryptoJS.AES.encrypt(
    password,
    process.env.PASS_SEC
  ).toString();

  try {
    // Create a new user and save to database
    const user = await User.create({
      username: username.toLowerCase(),
      email,
      password: encryptedPassword,
      role: role || "user",
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Route to log in a user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user in the database
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      // If user is not found, return error
      return res.status(404).json({ message: "User not found" });
    }

    // Decrypt user password and check if it matches input
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== password) {
      // If password is invalid, return error
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create a JWT token with user id and role and set as a cookie in response
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SEC
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Export router module
module.exports = router;

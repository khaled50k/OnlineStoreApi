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

// get user info using cookies
router.post("/", getUserId);
// Register a new user
router.post("/register", async (req, res) => {
  const user = new User({
    username: req.body.username.toLowerCase(),
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    role: req.body.role ? req.body.role : "user",
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Log in a user
router.post("/login", async (req, res) => {
  const user = await User.findOne({
    where: { username: req.body.username.toLowerCase() },
  });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const decryptedPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.PASS_SEC
  ).toString(CryptoJS.enc.Utf8);

  if (decryptedPassword !== req.body.password) {
    return res.status(400).send({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SEC
  );

  // Set the JWT token as a cookie in the response
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json({ message: "Login successful", token: token });
});

module.exports = router;

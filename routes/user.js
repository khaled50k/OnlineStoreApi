const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");

const router = require("express").Router();

// Update user by id
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  let { username, email, password, role, status } = req.body;

  // If the request body contains a password, encrypt it
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (username!=user.username) {
      const u = await User.findOne({ username: username });
     if (u) {
      return res.status(409).json({ message: "User is taken" });
     }
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status || user.status;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete user by id
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get user by id (only for admins)
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    // Find user by id and exclude password from the returned data
    const user = await User.findById(req.params.id);
    const { password, ...data } = user._doc;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get all users (only for admins)
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    // If the "new" query parameter is present, return the 5 newest users
    // Otherwise, return all users
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get user statistics (only for admins)
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    // Aggregate user data by month for the last year
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

// Require Category model and token verification functions
const Category = require("../models/Category");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// Create router instance
const router = require("express").Router();

// Create a new category
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newCategory = new Category(req.body);
  try {
    const savedCategory = await newCategory.save();
    res.status(200).json(savedCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update an existing category
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a category
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Category.findByIdAndRemove(req.params.id);
    res.status(200).json("Category has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Find a category by ID
router.get("/find/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

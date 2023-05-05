const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// Add new cart
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const newCart = new Cart(req.body); // Create new cart with request body
    const savedCart = await newCart.save(); // Save new cart to database
    await savedCart.updateAmount(); // Update cart's total amount
    res.status(200).json(savedCart); // Respond with saved cart as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating cart" }); // Respond with error message as JSON
  }
});

// Update cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body, // Update cart with request body
      },
      { new: true }
    );
    if (!updatedCart) {
      // If cart with requested ID not found, respond with error message as JSON
      return res.status(404).json({ error: "Cart not found" });
    }
    await updatedCart.updateAmount(); // Update cart's total amount
    res.status(200).json(updatedCart); // Respond with updated cart as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating cart" }); // Respond with error message as JSON
  }
});

// Delete cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndRemove(req.params.id); // Find and remove cart with requested ID
    if (!deletedCart) {
      // If cart with requested ID not found, respond with error message as JSON
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json({ message: "Cart has been deleted" }); // Respond with success message as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting cart" }); // Respond with error message as JSON
  }
});

// Find cart by user ID
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.id }); // Find cart with requested user ID
    if (!cart) {
      // If cart with requested user ID not found, respond with error message as JSON
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json(cart); // Respond with found cart as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error finding cart" }); // Respond with error message as JSON
  }
});

// Get all carts
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find(); // Find all carts
    res.status(200).json(carts); // Respond with found carts as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting carts" }); // Respond with error message as JSON
  }
});

module.exports = router;

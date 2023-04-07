const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart= await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});
// delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndRemove(req.params.id);
    res.status(200).json("Cart has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/find/:userid",verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({userId:req.params.userid});
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/",verifyTokenAndAdmin ,async (req, res) => {

  try {
   const carts=await Cart.find()
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;

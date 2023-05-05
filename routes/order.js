const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    await newOrder.updateAmount();
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  console.log('aa');
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    await updatedOrder.updateAmount();
    const savedOrder = await updatedOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});
// delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndRemove(req.params.id);
    res.status(200).json("Order has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/find/:userid", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userid });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const numMonths = req.query.month || 1; // Default to 1 month ago if no query parameter is provided
  const endDate = new Date();
  const startDate = new Date(endDate.setMonth(endDate.getMonth() - numMonths));

  try {
    const income = await Order.aggregate([
      { $match: { 
        createdAt: { $gte: startDate },
        status: { $ne: "cancelled" }
      } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

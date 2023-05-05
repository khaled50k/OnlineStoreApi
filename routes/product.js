// import Product model and verifyToken functions
const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// import express and create router instance
const router = require("express").Router();

// create new product endpoint with authentication and authorization
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update product endpoint with authentication and authorization
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete product endpoint with authentication and authorization
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// find product by id endpoint
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all products with optional query parameters
router.get("/", async (req, res) => {
  // extract query parameters from request
  const qNew = req.query.new;
  const qCategory = req.query.category;
  const limit = req.query.limit;

  try {
    let products;
    // if limit parameter is set, use limit to retrieve a limited number of products
    if (limit) {
      if (qNew) {
        products = await Product.find().sort({ createdAt: -1 }).limit(limit);
      } else if (qCategory) {
        products = await Product.find({
          "categories.categoryTitle": qCategory,
        }).limit(limit);
      } else {
        products = await Product.find().limit(limit);
      }
    }
    // if limit parameter is not set, retrieve all products
    else {
      if (qNew) {
        products = await Product.find().sort({ createdAt: -1 });
      } else if (qCategory) {
        products = await Product.find({
          "categories.categoryTitle": qCategory,
        });
      } else {
        products = await Product.find();
      }
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// export router for use in app
module.exports = router;

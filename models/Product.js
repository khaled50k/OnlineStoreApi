const mongoose = require("mongoose");
const Product = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: "",
      required: true,
    },
    sluger: {
      type: String,
      default: "",
      required: true,
    },
    categories: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
      },
    ],
    sizes: {
      type: Array,
      required: true,
      // enum: ["S", "M", "L", "XL", "XXL"],
    },
    colors: {
      type: Array,
      required: true,
      default: [],
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
            required:true
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Product", Product);

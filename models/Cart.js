const mongoose = require("mongoose");
const Cart = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
              totalPrice:{
                      type:Number,
                      required:true
              }
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Cart", Cart);


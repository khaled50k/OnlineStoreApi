const mongoose = require("mongoose");
const Order = mongoose.Schema(
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
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
  },
  {
    timestamps: true,
     toJSON: {
    virtuals: true // enable virtual properties in JSON output
  }
  }
);
Order.virtual('amount').get(function() {
  let total_price = 0;

  // Loop over the products in the order and add up the total price
  for (let i = 0; i < this.products.length; i++) {
    const product = this.products[i];
    total_price += product.id.price * product.quantity;
  }

  return total_price;
});
module.exports = mongoose.model("Order", Order);


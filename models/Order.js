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
    const discount = product.discount || 0; // default to 0 if no discount
    const price = product.price * (1 - discount / 100); // apply discount
    total_price += price * product.quantity;
  }

  return total_price;
});
module.exports = mongoose.model("Order", Order);


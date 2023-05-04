const mongoose = require("mongoose");
const Product = require('./Product.js');

const OrderSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Update the "amount" field for an order using the products array
OrderSchema.methods.updateAmount = async function() {
  const products = this.products.map(async (product) => {
    const p = await Product.findOne({_id: product.id});
    const discount = p.discount || 0;
    const price = p.price * (1 - discount / 100);
    return price * product.quantity;
  });
  const total_price = await Promise.all(products).then(prices => prices.reduce((acc, price) => acc + price, 0));
  this.amount = total_price;
  console.log(total_price);

  await this.save();
};

module.exports = mongoose.model("Order", OrderSchema);

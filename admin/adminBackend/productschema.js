const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  availableQuantity: { type: Number, required: true, default: 0 },
  date: { type: Date, default: Date.now }

});

mongoose.model("Product", productSchema);

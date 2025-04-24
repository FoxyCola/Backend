const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
nombre: { type: String, required: true },
stock: { type: Number, required: true },
precio: { type: Number, required: true },
});

module.exports = mongoose.model("Inventory", inventorySchema);

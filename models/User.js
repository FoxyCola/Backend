const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    cardInfo: {
      name: { type: String, default: "foxycola" },
      number: { type: String, default: "" },
      expiryDate: { type: String, default: "" },
      securityCode: { type: String, default: "" } 
    }
  }, { timestamps: true });
  

module.exports = mongoose.model("User", userSchema);

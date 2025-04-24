const express = require("express");
const User = require("../models/User");
const Inventory = require("../models/Inventory");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, cardInfo, cart } = req.body;

    if (!cardInfo || !cardInfo.securityCode) {
      return res.status(400).json({ message: "Datos de la tarjeta no proporcionados correctamente" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isCardValid =
      user.cardInfo &&
      user.cardInfo.number === cardInfo.number &&
      user.cardInfo.expiryDate === cardInfo.expiryDate &&
      user.cardInfo.securityCode === cardInfo.securityCode &&
      user.cardInfo.name.toLowerCase() === cardInfo.name.toLowerCase(); // insensitive

    if (!isCardValid) {
      return res.status(400).json({ message: "La información de la tarjeta no coincide con la registrada" });
    }

    for (let item of cart) {
      const product = await Inventory.findById(item._id);
      if (!product || product.stock < 1) {
        return res.status(400).json({ message: `Stock insuficiente para ${item.nombre}` });
      }
      product.stock -= 1;
      await product.save();
    }

    res.json({ message: "Compra realizada con éxito", cart });
  } catch (error) {
    console.error("Error en la compra:", error);
    res.status(500).json({ message: "Error en la compra", error });
  }
});

module.exports = router;
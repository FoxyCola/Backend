const express = require("express");
const Inventory = require("../models/Inventory");

const router = express.Router();

// Obtener todos los ítems del inventario
router.get("/", async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el inventario", error });
  }
});

// Agregar un nuevo ítem al inventario
router.post("/", async (req, res) => {
  try {
    const { nombre, stock, precio } = req.body;
    const newItem = new Inventory({ nombre, stock, precio });
    await newItem.save();
    res.status(201).json({ message: "Ítem agregado al inventario", newItem });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar ítem", error });
  }
});

// Editar un ítem del inventario
router.put("/:id", async (req, res) => {
  try {
    const { stock, precio } = req.body;
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      { stock, precio },
      { new: true }
    );
    res.json({ message: "Ítem actualizado", updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar ítem", error });
  }
});

// Eliminar un ítem del inventario
router.delete("/:id", async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Ítem eliminado del inventario" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar ítem", error });
  }
});

module.exports = router;

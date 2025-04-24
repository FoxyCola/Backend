const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 📌 Registro de usuario
router.post("/register", async (req, res) => {
    try {
        const { nombre, email, password, role, cardInfo } = req.body;
        console.log("Datos recibidos en el backend:", req.body);

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "El usuario ya existe" });

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario con datos de tarjeta
        const newUser = new User({
            nombre,
            email,
            password: hashedPassword,
            role,
            cardInfo: cardInfo || { name: "", number: "", expiryDate: "", securityCode: "" } // Valor por defecto si no se envía
        });

        await newUser.save();
        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
});

// 📌 Login de usuario
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

        // Comparar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

        // Generar token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user._id, nombre: user.nombre, email: user.email, role: user.role, cardInfo: user.cardInfo } });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
});

// 📌 Obtener usuario autenticado
router.get("/user", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Obtener el token del encabezado
        if (!token) return res.status(401).json({ message: "No autorizado" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password"); // No enviar la contraseña

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
});

// 📌 Guardar o actualizar tarjeta del usuario
router.post("/save-card", async (req, res) => {
    try {
        const { userId, cardName, cardNumber, expiryDate, securityCode } = req.body;

        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        // Verificar que el nombre en la tarjeta coincida con el del usuario
        if (user.nombre.trim().toLowerCase() !== cardName.trim().toLowerCase()) {
            return res.status(400).json({ message: "El nombre en la tarjeta no coincide con el del usuario" });
        }

        // Guardar los datos de la tarjeta
        user.cardInfo = {
            name: cardName,
            number: cardNumber,
            expiryDate,
            securityCode,
        };

        await user.save();
        res.status(200).json({ message: "Tarjeta registrada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
});

module.exports = router;
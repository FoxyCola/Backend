require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: "https://frontend2025tienda.vercel.app/", // Permite solo el frontend local
    credentials: true, // Permite enviar cookies o tokens en headers
    allowedHeaders: ["Content-Type", "Authorization"] // Asegurar que se permita el token
}));
app.use(express.json());

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB Atlas"))
.catch(err => console.error("❌ Error al conectar a MongoDB:", err));

// Verificar conexión
mongoose.connection.on("connected", () => {
console.log("✅ MongoDB está conectado correctamente.");
});

mongoose.connection.on("error", (err) => {
console.error("❌ Error en la conexión a MongoDB:", err);
});

// Ruta de prueba
app.get("/", (req, res) => {
res.send("Servidor funcionando correctamente");
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;

// Importar rutas
const authRoutes = require("./routes/auth");
const inventoryRoutes = require("./routes/inventory");
const purchaseRoutes = require("./routes/purchase");

// Usar rutas
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/purchase", purchaseRoutes);

app.listen(PORT, () => {
console.log(`🚀 Servidor corriendo en vercel!`);
});
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Rutas
app.use("/api/estudiantes", require("./routes/estudiantes"));
app.use("/api/registros", require("./routes/registros"));
app.use("/api/webauthn", require("./routes/webauthn"));

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Servidor Backend - LlegadasTarde                ║
║                                                       ║
║   📡 Puerto: ${PORT}                                    ║
║   🌍 Entorno: ${
    process.env.NODE_ENV || "development"
  }                        ║
║   ⏰ Iniciado: ${new Date().toLocaleString("es-CO")}      ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Manejo de cierre graceful
process.on("SIGTERM", () => {
  console.log("SIGTERM recibido. Cerrando servidor...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\nSIGINT recibido. Cerrando servidor...");
  process.exit(0);
});

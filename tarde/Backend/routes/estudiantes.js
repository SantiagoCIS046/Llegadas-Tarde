const express = require("express");
const router = express.Router();
const {
  obtenerEstudiantes,
  obtenerEstudiantePorId,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
  generarQR,
  buscarPorCedula,
} = require("../controllers/estudianteController");

// Rutas especiales (deben ir ANTES de las rutas con :id)
router.get("/cedula/:cedula", buscarPorCedula);
router.post("/:id/generar-qr", generarQR);

// Rutas CRUD
router.get("/", obtenerEstudiantes);
router.get("/:id", obtenerEstudiantePorId);
router.post("/", crearEstudiante);
router.put("/:id", actualizarEstudiante);
router.delete("/:id", eliminarEstudiante);

module.exports = router;

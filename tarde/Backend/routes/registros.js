const express = require('express');
const router = express.Router();
const {
  crearRegistro,
  registrarPorQR,
  registrarPorHuella,
  registrarPorFaceId,
  obtenerRegistros,
  obtenerEstadisticas
} = require('../controllers/registroController');

// Rutas de registro
router.post('/', crearRegistro);
router.post('/qr', registrarPorQR);
router.post('/huella', registrarPorHuella);
router.post('/faceid', registrarPorFaceId);

// Consultas
router.get('/', obtenerRegistros);
router.get('/estadisticas', obtenerEstadisticas);

module.exports = router;


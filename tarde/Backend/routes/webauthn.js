const express = require("express");
const router = express.Router();
const webauthnController = require("../controllers/webauthnController");

// ============ HUELLA ============

// Registro de huella
router.post(
  "/huella/registro/opciones",
  webauthnController.generarOpcionesRegistroHuella
);
router.post(
  "/huella/registro/verificar",
  webauthnController.verificarRegistroHuella
);

// Autenticación con huella (para registro de llegada)
router.post(
  "/huella/autenticacion/opciones",
  webauthnController.generarOpcionesAutenticacionHuella
);
router.post(
  "/huella/autenticacion/verificar",
  webauthnController.verificarAutenticacionHuella
);

// ============ FACE ID ============

// Registro de Face ID
router.post(
  "/faceid/registro/opciones",
  webauthnController.generarOpcionesRegistroFaceId
);
router.post(
  "/faceid/registro/verificar",
  webauthnController.verificarRegistroFaceId
);

// Autenticación con Face ID (para registro de llegada)
router.post(
  "/faceid/autenticacion/opciones",
  webauthnController.generarOpcionesAutenticacionFaceId
);
router.post(
  "/faceid/autenticacion/verificar",
  webauthnController.verificarAutenticacionFaceId
);

module.exports = router;


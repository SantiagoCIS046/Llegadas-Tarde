const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require("@simplewebauthn/server");
const Estudiante = require("../models/Estudiante");
const RegistroLlegada = require("../models/RegistroLlegada");

// Configuración
const rpName = "Sistema SENA - Llegadas Tarde";
const rpID = "localhost"; // Cambiar en producción
const origin = process.env.FRONTEND_URL || "http://localhost:5173";

// Almacenamiento temporal de challenges (en producción usar Redis o DB)
const challenges = new Map();

// Generar opciones de registro para huella
exports.generarOpcionesRegistroHuella = async (req, res) => {
  try {
    const { cedula } = req.body;

    if (!cedula) {
      return res.status(400).json({
        success: false,
        message: "Cédula requerida",
      });
    }

    // Buscar estudiante
    const estudiante = await Estudiante.findOne({ cedula });

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    // Generar opciones
    // Convertir el ID del estudiante a Uint8Array
    const userIDBuffer = Buffer.from(estudiante._id.toString());

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: userIDBuffer,
      userName: estudiante.cedula,
      userDisplayName: estudiante.nombre,
      timeout: 60000,
      attestationType: "none",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "preferred",
      },
    });

    // Guardar challenge temporalmente
    challenges.set(cedula + "_huella", options.challenge);

    res.json({
      success: true,
      data: options,
      estudianteId: estudiante._id,
    });
  } catch (error) {
    console.error("Error generando opciones de registro huella:", error);
    res.status(500).json({
      success: false,
      message: "Error al generar opciones de registro",
      error: error.message,
    });
  }
};

// Verificar registro de huella
exports.verificarRegistroHuella = async (req, res) => {
  try {
    const { cedula, attestation } = req.body;

    if (!cedula || !attestation) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos",
      });
    }

    const estudiante = await Estudiante.findOne({ cedula });

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    const expectedChallenge = challenges.get(cedula + "_huella");

    if (!expectedChallenge) {
      return res.status(400).json({
        success: false,
        message: "Challenge no encontrado o expirado",
      });
    }

    // Verificar la respuesta
    const verification = await verifyRegistrationResponse({
      response: attestation,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      const { credentialPublicKey, credentialID, counter } = registrationInfo;

      // Guardar credencial en el estudiante
      estudiante.huellaRegistrada = true;
      estudiante.credencialHuella = {
        credentialID: Buffer.from(credentialID).toString("base64"),
        credentialPublicKey:
          Buffer.from(credentialPublicKey).toString("base64"),
        counter,
      };

      await estudiante.save();

      // Limpiar challenge
      challenges.delete(cedula + "_huella");

      res.json({
        success: true,
        message: "Huella registrada exitosamente",
        data: {
          estudiante: {
            id: estudiante._id,
            nombre: estudiante.nombre,
            cedula: estudiante.cedula,
          },
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Verificación fallida",
      });
    }
  } catch (error) {
    console.error("Error verificando registro huella:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar registro",
      error: error.message,
    });
  }
};

// Generar opciones de autenticación para huella (para registro de llegada)
exports.generarOpcionesAutenticacionHuella = async (req, res) => {
  try {
    const { cedula } = req.body;

    if (!cedula) {
      return res.status(400).json({
        success: false,
        message: "Cédula requerida",
      });
    }

    const estudiante = await Estudiante.findOne({ cedula });

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    if (!estudiante.huellaRegistrada || !estudiante.credencialHuella) {
      return res.status(400).json({
        success: false,
        message: "Estudiante no tiene huella registrada",
      });
    }

    // Generar opciones de autenticación
    const options = await generateAuthenticationOptions({
      rpID,
      timeout: 60000,
      userVerification: "required",
      allowCredentials: [
        {
          id: Buffer.from(estudiante.credencialHuella.credentialID, "base64"),
          type: "public-key",
          transports: ["internal"],
        },
      ],
    });

    // Guardar challenge
    challenges.set(cedula + "_auth_huella", options.challenge);

    res.json({
      success: true,
      data: options,
      estudianteId: estudiante._id,
    });
  } catch (error) {
    console.error("Error generando opciones de autenticación huella:", error);
    res.status(500).json({
      success: false,
      message: "Error al generar opciones de autenticación",
      error: error.message,
    });
  }
};

// Verificar autenticación de huella y crear registro
exports.verificarAutenticacionHuella = async (req, res) => {
  try {
    const { cedula, assertion, dispositivo } = req.body;

    if (!cedula || !assertion) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos",
      });
    }

    const estudiante = await Estudiante.findOne({ cedula });

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    const expectedChallenge = challenges.get(cedula + "_auth_huella");

    if (!expectedChallenge) {
      return res.status(400).json({
        success: false,
        message: "Challenge no encontrado o expirado",
      });
    }

    // Verificar la autenticación
    const verification = await verifyAuthenticationResponse({
      response: assertion,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: Buffer.from(
          estudiante.credencialHuella.credentialID,
          "base64"
        ),
        credentialPublicKey: Buffer.from(
          estudiante.credencialHuella.credentialPublicKey,
          "base64"
        ),
        counter: estudiante.credencialHuella.counter,
      },
    });

    const { verified, authenticationInfo } = verification;

    if (verified) {
      // Actualizar counter
      estudiante.credencialHuella.counter = authenticationInfo.newCounter;
      await estudiante.save();

      // Crear registro de llegada
      const registro = new RegistroLlegada({
        estudiante: estudiante._id,
        cedula: estudiante.cedula,
        nombre: estudiante.nombre,
        numeroFicha: estudiante.numeroFicha,
        metodoRegistro: "HUELLA",
        dispositivo: dispositivo || "Desconocido",
      });

      await registro.save();

      // Limpiar challenge
      challenges.delete(cedula + "_auth_huella");

      res.json({
        success: true,
        message: "Registro de llegada creado exitosamente",
        data: {
          registro,
          estudiante: {
            nombre: estudiante.nombre,
            cedula: estudiante.cedula,
            numeroFicha: estudiante.numeroFicha,
          },
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Autenticación fallida",
      });
    }
  } catch (error) {
    console.error("Error verificando autenticación huella:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar autenticación",
      error: error.message,
    });
  }
};

// ============ FACE ID ============

// Generar opciones de registro para Face ID
exports.generarOpcionesRegistroFaceId = async (req, res) => {
  try {
    const { cedula } = req.body;

    if (!cedula) {
      return res.status(400).json({
        success: false,
        message: "Cédula requerida",
      });
    }

    const estudiante = await Estudiante.findOne({ cedula });

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    // Convertir el ID del estudiante a Uint8Array
    const userIDBuffer = Buffer.from(estudiante._id.toString());

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: userIDBuffer,
      userName: estudiante.cedula,
      userDisplayName: estudiante.nombre,
      timeout: 60000,
      attestationType: "none",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "preferred",
      },
    });

    challenges.set(cedula + "_faceid", options.challenge);

    res.json({
      success: true,
      data: options,
      estudianteId: estudiante._id,
    });
  } catch (error) {
    console.error("Error generando opciones de registro Face ID:", error);
    res.status(500).json({
      success: false,
      message: "Error al generar opciones de registro",
      error: error.message,
    });
  }
};

// Verificar registro de Face ID
exports.verificarRegistroFaceId = async (req, res) => {
  try {
    const { cedula, attestation } = req.body;

    if (!cedula || !attestation) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos",
      });
    }

    const estudiante = await Estudiante.findOne({ cedula });

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    const expectedChallenge = challenges.get(cedula + "_faceid");

    if (!expectedChallenge) {
      return res.status(400).json({
        success: false,
        message: "Challenge no encontrado o expirado",
      });
    }

    const verification = await verifyRegistrationResponse({
      response: attestation,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      const { credentialPublicKey, credentialID, counter } = registrationInfo;

      estudiante.faceIdRegistrado = true;
      estudiante.credencialFaceId = {
        credentialID: Buffer.from(credentialID).toString("base64"),
        credentialPublicKey:
          Buffer.from(credentialPublicKey).toString("base64"),
        counter,
      };

      await estudiante.save();
      challenges.delete(cedula + "_faceid");

      res.json({
        success: true,
        message: "Face ID registrado exitosamente",
        data: {
          estudiante: {
            id: estudiante._id,
            nombre: estudiante.nombre,
            cedula: estudiante.cedula,
          },
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Verificación fallida",
      });
    }
  } catch (error) {
    console.error("Error verificando registro Face ID:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar registro",
      error: error.message,
    });
  }
};

// Generar opciones de autenticación para Face ID
exports.generarOpcionesAutenticacionFaceId = async (req, res) => {
  try {
    const { cedula } = req.body;

    if (!cedula) {
      return res.status(400).json({
        success: false,
        message: "Cédula requerida",
      });
    }

    const estudiante = await Estudiante.findOne({ cedula });

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    if (!estudiante.faceIdRegistrado || !estudiante.credencialFaceId) {
      return res.status(400).json({
        success: false,
        message: "Estudiante no tiene Face ID registrado",
      });
    }

    const options = await generateAuthenticationOptions({
      rpID,
      timeout: 60000,
      userVerification: "required",
      allowCredentials: [
        {
          id: Buffer.from(estudiante.credencialFaceId.credentialID, "base64"),
          type: "public-key",
          transports: ["internal"],
        },
      ],
    });

    challenges.set(cedula + "_auth_faceid", options.challenge);

    res.json({
      success: true,
      data: options,
      estudianteId: estudiante._id,
    });
  } catch (error) {
    console.error("Error generando opciones de autenticación Face ID:", error);
    res.status(500).json({
      success: false,
      message: "Error al generar opciones de autenticación",
      error: error.message,
    });
  }
};

// Verificar autenticación de Face ID y crear registro
exports.verificarAutenticacionFaceId = async (req, res) => {
  try {
    const { cedula, assertion, dispositivo } = req.body;

    if (!cedula || !assertion) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos",
      });
    }

    const estudiante = await Estudiante.findOne({ cedula });

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    const expectedChallenge = challenges.get(cedula + "_auth_faceid");

    if (!expectedChallenge) {
      return res.status(400).json({
        success: false,
        message: "Challenge no encontrado o expirado",
      });
    }

    const verification = await verifyAuthenticationResponse({
      response: assertion,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: Buffer.from(
          estudiante.credencialFaceId.credentialID,
          "base64"
        ),
        credentialPublicKey: Buffer.from(
          estudiante.credencialFaceId.credentialPublicKey,
          "base64"
        ),
        counter: estudiante.credencialFaceId.counter,
      },
    });

    const { verified, authenticationInfo } = verification;

    if (verified) {
      estudiante.credencialFaceId.counter = authenticationInfo.newCounter;
      await estudiante.save();

      const registro = new RegistroLlegada({
        estudiante: estudiante._id,
        cedula: estudiante.cedula,
        nombre: estudiante.nombre,
        numeroFicha: estudiante.numeroFicha,
        metodoRegistro: "FACEID",
        dispositivo: dispositivo || "Desconocido",
      });

      await registro.save();
      challenges.delete(cedula + "_auth_faceid");

      res.json({
        success: true,
        message: "Registro de llegada creado exitosamente",
        data: {
          registro,
          estudiante: {
            nombre: estudiante.nombre,
            cedula: estudiante.cedula,
            numeroFicha: estudiante.numeroFicha,
          },
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Autenticación fallida",
      });
    }
  } catch (error) {
    console.error("Error verificando autenticación Face ID:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar autenticación",
      error: error.message,
    });
  }
};

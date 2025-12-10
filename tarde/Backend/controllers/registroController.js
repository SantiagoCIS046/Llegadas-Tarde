const RegistroLlegada = require("../models/RegistroLlegada");
const Estudiante = require("../models/Estudiante");

// Crear registro de llegada
exports.crearRegistro = async (req, res) => {
  try {
    const {
      estudianteId,
      metodoRegistro,
      observaciones,
      ubicacion,
      dispositivo,
    } = req.body;

    // Buscar estudiante
    const estudiante = await Estudiante.findById(estudianteId);

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    // Crear registro
    const registro = new RegistroLlegada({
      estudiante: estudiante._id,
      cedula: estudiante.cedula,
      nombre: estudiante.nombre,
      numeroFicha: estudiante.numeroFicha,
      metodoRegistro,
      observaciones,
      ubicacion,
      dispositivo,
    });

    await registro.save();

    res.status(201).json({
      success: true,
      message: "Registro creado exitosamente",
      data: registro,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al crear registro",
      error: error.message,
    });
  }
};

// Registrar llegada por QR
exports.registrarPorQR = async (req, res) => {
  try {
    const { qrCode, dispositivo } = req.body;

    // Buscar estudiante por código QR
    const estudiante = await Estudiante.findOne({ qrCode, activo: true });

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Código QR inválido o estudiante no encontrado",
      });
    }

    // Verificar si ya se registró hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const registroExistente = await RegistroLlegada.findOne({
      estudiante: estudiante._id,
      fechaHora: { $gte: hoy },
    });

    if (registroExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un registro de llegada para hoy",
        data: registroExistente,
      });
    }

    // Crear registro
    const registro = new RegistroLlegada({
      estudiante: estudiante._id,
      cedula: estudiante.cedula,
      nombre: estudiante.nombre,
      numeroFicha: estudiante.numeroFicha,
      metodoRegistro: "QR",
      dispositivo,
    });

    await registro.save();

    res.status(201).json({
      success: true,
      message: `Registro exitoso. ${
        registro.esRetardo
          ? `Llegada tarde: ${registro.minutosRetardo} minutos`
          : "Llegada a tiempo"
      }`,
      data: registro,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al registrar llegada",
      error: error.message,
    });
  }
};

// Registrar llegada por huella
exports.registrarPorHuella = async (req, res) => {
  try {
    const { cedula, credencialId, dispositivo } = req.body;

    const estudiante = await Estudiante.findOne({ cedula, activo: true });

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    // Verificar credencial de huella
    if (
      !estudiante.huellaRegistrada ||
      estudiante.credencialHuella !== credencialId
    ) {
      return res.status(401).json({
        success: false,
        message: "Huella no registrada o no coincide",
      });
    }

    // Verificar registro del día
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const registroExistente = await RegistroLlegada.findOne({
      estudiante: estudiante._id,
      fechaHora: { $gte: hoy },
    });

    if (registroExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un registro de llegada para hoy",
      });
    }

    const registro = new RegistroLlegada({
      estudiante: estudiante._id,
      cedula: estudiante.cedula,
      nombre: estudiante.nombre,
      numeroFicha: estudiante.numeroFicha,
      metodoRegistro: "HUELLA",
      dispositivo,
    });

    await registro.save();

    res.status(201).json({
      success: true,
      message: `Registro exitoso. ${
        registro.esRetardo
          ? `Llegada tarde: ${registro.minutosRetardo} minutos`
          : "Llegada a tiempo"
      }`,
      data: registro,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al registrar llegada",
      error: error.message,
    });
  }
};

// Registrar llegada por Face ID
exports.registrarPorFaceId = async (req, res) => {
  try {
    const { cedula, credencialId, dispositivo } = req.body;

    const estudiante = await Estudiante.findOne({ cedula, activo: true });

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    // Verificar credencial de Face ID
    if (
      !estudiante.faceIdRegistrado ||
      estudiante.credencialFaceId !== credencialId
    ) {
      return res.status(401).json({
        success: false,
        message: "Face ID no registrado o no coincide",
      });
    }

    // Verificar registro del día
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const registroExistente = await RegistroLlegada.findOne({
      estudiante: estudiante._id,
      fechaHora: { $gte: hoy },
    });

    if (registroExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un registro de llegada para hoy",
      });
    }

    const registro = new RegistroLlegada({
      estudiante: estudiante._id,
      cedula: estudiante.cedula,
      nombre: estudiante.nombre,
      numeroFicha: estudiante.numeroFicha,
      metodoRegistro: "FACEID",
      dispositivo,
    });

    await registro.save();

    res.status(201).json({
      success: true,
      message: `Registro exitoso. ${
        registro.esRetardo
          ? `Llegada tarde: ${registro.minutosRetardo} minutos`
          : "Llegada a tiempo"
      }`,
      data: registro,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al registrar llegada",
      error: error.message,
    });
  }
};

// Obtener todos los registros con filtros
exports.obtenerRegistros = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      fechaInicio,
      fechaFin,
      ficha,
      metodo,
      soloRetardos,
    } = req.query;

    const query = {};

    if (fechaInicio && fechaFin) {
      query.fechaHora = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      };
    }

    if (ficha) {
      query.numeroFicha = ficha;
    }

    if (metodo) {
      query.metodoRegistro = metodo;
    }

    if (soloRetardos === "true") {
      query.esRetardo = true;
    }

    const registros = await RegistroLlegada.find(query)
      .populate("estudiante", "nombre cedula numeroFicha")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ fechaHora: -1 });

    const count = await RegistroLlegada.countDocuments(query);

    res.json({
      success: true,
      data: registros,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener registros",
      error: error.message,
    });
  }
};

// Obtener estadísticas
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const totalHoy = await RegistroLlegada.countDocuments({
      fechaHora: { $gte: hoy },
    });

    const retardosHoy = await RegistroLlegada.countDocuments({
      fechaHora: { $gte: hoy },
      esRetardo: true,
    });

    const porMetodo = await RegistroLlegada.aggregate([
      { $match: { fechaHora: { $gte: hoy } } },
      { $group: { _id: "$metodoRegistro", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        totalHoy,
        retardosHoy,
        aTiempoHoy: totalHoy - retardosHoy,
        porMetodo,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message,
    });
  }
};

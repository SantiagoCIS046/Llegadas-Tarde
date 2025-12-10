const Estudiante = require("../models/Estudiante");
const QRCode = require("qrcode");

// Obtener todos los estudiantes
exports.obtenerEstudiantes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", ficha = "" } = req.query;

    const query = { activo: true };

    if (search) {
      query.$or = [
        { nombre: { $regex: search, $options: "i" } },
        { cedula: { $regex: search, $options: "i" } },
      ];
    }

    if (ficha) {
      query.numeroFicha = ficha;
    }

    const estudiantes = await Estudiante.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ nombre: 1 });

    const count = await Estudiante.countDocuments(query);

    res.json({
      success: true,
      data: estudiantes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener estudiantes",
      error: error.message,
    });
  }
};

// Obtener estudiante por ID
exports.obtenerEstudiantePorId = async (req, res) => {
  try {
    const estudiante = await Estudiante.findById(req.params.id);

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    res.json({
      success: true,
      data: estudiante,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener estudiante",
      error: error.message,
    });
  }
};

// Crear nuevo estudiante
exports.crearEstudiante = async (req, res) => {
  try {
    const { cedula, nombre, numeroFicha, email, telefono } = req.body;

    // Verificar si ya existe
    const estudianteExistente = await Estudiante.findOne({ cedula });
    if (estudianteExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un estudiante con esta cédula",
      });
    }

    const estudiante = new Estudiante({
      cedula,
      nombre,
      numeroFicha,
      email,
      telefono,
    });

    await estudiante.save();

    res.status(201).json({
      success: true,
      message: "Estudiante creado exitosamente",
      data: estudiante,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al crear estudiante",
      error: error.message,
    });
  }
};

// Actualizar estudiante
exports.actualizarEstudiante = async (req, res) => {
  try {
    const { cedula, nombre, numeroFicha, email, telefono } = req.body;

    const estudiante = await Estudiante.findByIdAndUpdate(
      req.params.id,
      { cedula, nombre, numeroFicha, email, telefono },
      { new: true, runValidators: true }
    );

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Estudiante actualizado exitosamente",
      data: estudiante,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al actualizar estudiante",
      error: error.message,
    });
  }
};

// Eliminar estudiante (soft delete)
exports.eliminarEstudiante = async (req, res) => {
  try {
    const estudiante = await Estudiante.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Estudiante eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar estudiante",
      error: error.message,
    });
  }
};

// Generar código QR para estudiante
exports.generarQR = async (req, res) => {
  try {
    const estudiante = await Estudiante.findById(req.params.id);

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    // Generar código único si no existe
    if (!estudiante.qrCode) {
      estudiante.generarQRCode();
      await estudiante.save();
    }

    // Generar imagen QR
    const qrDataURL = await QRCode.toDataURL(estudiante.qrCode, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    res.json({
      success: true,
      data: {
        qrCode: estudiante.qrCode,
        qrImage: qrDataURL,
        estudiante: {
          nombre: estudiante.nombre,
          cedula: estudiante.cedula,
          numeroFicha: estudiante.numeroFicha,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar código QR",
      error: error.message,
    });
  }
};

// Buscar estudiante por cédula
exports.buscarPorCedula = async (req, res) => {
  try {
    const estudiante = await Estudiante.findOne({
      cedula: req.params.cedula,
      activo: true,
    });

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      });
    }

    res.json({
      success: true,
      data: estudiante,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al buscar estudiante",
      error: error.message,
    });
  }
};

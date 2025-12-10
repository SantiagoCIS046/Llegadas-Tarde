const mongoose = require("mongoose");

const estudianteSchema = new mongoose.Schema(
  {
    cedula: {
      type: String,
      required: [true, "La cédula es obligatoria"],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{6,10}$/.test(v);
        },
        message: "La cédula debe contener entre 6 y 10 dígitos",
      },
    },
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    numeroFicha: {
      type: String,
      required: [true, "El número de ficha es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // Email es opcional
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Email inválido",
      },
    },
    telefono: {
      type: String,
      trim: true,
    },
    // Datos biométricos
    huellaRegistrada: {
      type: Boolean,
      default: false,
    },
    credencialHuella: {
      type: String, // ID de la credencial WebAuthn
      default: null,
    },
    faceIdRegistrado: {
      type: Boolean,
      default: false,
    },
    credencialFaceId: {
      type: String,
      default: null,
    },
    // QR Code personal
    qrCode: {
      type: String,
      unique: true,
      sparse: true, // Permite múltiples valores null
    },
    activo: {
      type: Boolean,
      default: true,
    },
    fechaRegistro: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas rápidas (cedula ya tiene índice único automático)
estudianteSchema.index({ numeroFicha: 1 });
estudianteSchema.index({ nombre: "text" });

// Método para generar código QR único
estudianteSchema.methods.generarQRCode = function () {
  const { v4: uuidv4 } = require("uuid");
  this.qrCode = `EST-${this.cedula}-${uuidv4()}`;
  return this.qrCode;
};

module.exports = mongoose.model("Estudiante", estudianteSchema);

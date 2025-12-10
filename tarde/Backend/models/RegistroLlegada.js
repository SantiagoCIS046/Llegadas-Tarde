const mongoose = require('mongoose');

const registroLlegadaSchema = new mongoose.Schema({
  estudiante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estudiante',
    required: true
  },
  cedula: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  numeroFicha: {
    type: String,
    required: true
  },
  fechaHora: {
    type: Date,
    default: Date.now,
    required: true
  },
  metodoRegistro: {
    type: String,
    enum: ['QR', 'HUELLA', 'FACEID', 'MANUAL'],
    required: true
  },
  horaLlegada: {
    type: String, // Formato HH:MM
    required: true
  },
  esRetardo: {
    type: Boolean,
    default: false
  },
  horaLimite: {
    type: String, // Hora límite configurada (ej: "07:00")
    default: '07:00'
  },
  minutosRetardo: {
    type: Number,
    default: 0
  },
  observaciones: {
    type: String,
    trim: true
  },
  ubicacion: {
    latitud: Number,
    longitud: Number
  },
  dispositivo: {
    tipo: String, // 'iOS', 'Android', 'Web'
    navegador: String,
    sistemaOperativo: String
  }
}, {
  timestamps: true
});

// Índices para consultas eficientes
registroLlegadaSchema.index({ estudiante: 1, fechaHora: -1 });
registroLlegadaSchema.index({ cedula: 1 });
registroLlegadaSchema.index({ numeroFicha: 1 });
registroLlegadaSchema.index({ fechaHora: -1 });
registroLlegadaSchema.index({ metodoRegistro: 1 });

// Método para calcular si es retardo
registroLlegadaSchema.methods.calcularRetardo = function() {
  const horaLlegadaDate = new Date(`2000-01-01T${this.horaLlegada}:00`);
  const horaLimiteDate = new Date(`2000-01-01T${this.horaLimite}:00`);
  
  if (horaLlegadaDate > horaLimiteDate) {
    this.esRetardo = true;
    const diffMs = horaLlegadaDate - horaLimiteDate;
    this.minutosRetardo = Math.floor(diffMs / 60000);
  } else {
    this.esRetardo = false;
    this.minutosRetardo = 0;
  }
};

// Pre-save hook para calcular retardo automáticamente
registroLlegadaSchema.pre('save', function(next) {
  if (!this.horaLlegada) {
    const now = new Date();
    this.horaLlegada = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
  this.calcularRetardo();
  next();
});

module.exports = mongoose.model('RegistroLlegada', registroLlegadaSchema);


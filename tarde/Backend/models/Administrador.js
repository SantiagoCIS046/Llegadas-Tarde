const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const administradorSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: [true, 'El usuario es obligatorio'],
    unique: true,
    trim: true,
    minlength: [4, 'El usuario debe tener al menos 4 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Email inválido'
    }
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  rol: {
    type: String,
    enum: ['admin', 'supervisor'],
    default: 'admin'
  },
  activo: {
    type: Boolean,
    default: true
  },
  ultimoAcceso: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash de contraseña antes de guardar
administradorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
administradorSchema.methods.compararPassword = async function(passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('Administrador', administradorSchema);


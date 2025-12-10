<template>
  <div class="home">
    <div class="container">
      <div class="hero">
        <h1 class="hero-title">🎓 Sistema de Registro de Llegadas Tarde</h1>
        <p class="hero-subtitle">SENA - Gestión de Asistencia Estudiantil</p>
      </div>

      <div class="options-grid">
        <div class="option-card card highlight" @click="navigateTo('/mi-qr')">
          <div class="option-icon">🎫</div>
          <h3>Mi Código QR</h3>
          <p>Genera tu código QR personal para registrar llegadas</p>
        </div>

        <div class="option-card card" @click="navigateTo('/registro-qr')">
          <div class="option-icon">📱</div>
          <h3>Escanear QR</h3>
          <p>Escanea un código QR para registrar llegada</p>
        </div>

        <div class="option-card card" @click="navigateTo('/registro-huella')">
          <div class="option-icon">👆</div>
          <h3>Registro por Huella</h3>
          <p>Usa tu huella dactilar para registrarte</p>
        </div>

        <div class="option-card card" @click="navigateTo('/registro-faceid')">
          <div class="option-icon">😊</div>
          <h3>Registro por Face ID</h3>
          <p>Reconocimiento facial para registro rápido</p>
        </div>

        <div class="option-card card admin" @click="navigateTo('/estudiantes')">
          <div class="option-icon">⚙️</div>
          <h3>Administración</h3>
          <p>Gestionar estudiantes y registros</p>
        </div>
      </div>

      <div class="info-section">
        <div class="card">
          <h2>📋 Instrucciones</h2>
          <ul class="instructions-list">
            <li>
              <strong>Estudiantes:</strong> Selecciona tu método preferido de
              registro (QR, Huella o Face ID)
            </li>
            <li>
              <strong>Administradores:</strong> Accede a la sección de
              administración para gestionar estudiantes
            </li>
            <li>
              <strong>Horario límite:</strong> 7:00 AM - Llegadas posteriores se
              registran como retardo
            </li>
            <li>
              <strong>Soporte:</strong> Compatible con dispositivos iOS y
              Android
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
.home {
  padding: 2rem 0;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #39a900 0%, #2d8500 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 10px 30px rgba(57, 169, 0, 0.3);
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: white;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.option-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 2rem;
  border: 2px solid transparent;
}

.option-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-color);
}

.option-card.highlight {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: 3px solid #2e7d32;
}

.option-card.highlight h3,
.option-card.highlight p {
  color: white;
}

.option-card.highlight:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(76, 175, 80, 0.3);
}

.option-card.admin {
  background: linear-gradient(135deg, #ff6b00 0%, #e55f00 100%);
  color: white;
}

.option-card.admin h3,
.option-card.admin p {
  color: white;
}

.option-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.option-card h3 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.option-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.info-section {
  margin-top: 3rem;
}

.info-section h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.instructions-list {
  list-style: none;
  padding: 0;
}

.instructions-list li {
  padding: 1rem;
  margin-bottom: 0.75rem;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .options-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>

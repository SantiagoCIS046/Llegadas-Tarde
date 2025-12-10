<template>
  <div class="registro-faceid">
    <div class="container">
      <div class="header">
        <h1>😊 Registro por Face ID</h1>
        <router-link to="/" class="btn btn-outline">← Volver</router-link>
      </div>

      <div class="auth-card card">
        <div class="icon-large">🎭</div>
        <h2>Reconocimiento Facial</h2>
        <p>Usa Face ID o reconocimiento facial para registrar tu llegada</p>

        <div v-if="!soportado" class="warning-message">
          ⚠️ Tu navegador no soporta autenticación biométrica.
          <br />Por favor, usa Safari en iOS o Chrome/Edge en dispositivos
          compatibles.
        </div>

        <div v-else class="form-section">
          <div class="form-group">
            <label class="form-label">Cédula</label>
            <input
              v-model="cedula"
              type="text"
              class="form-control"
              placeholder="Ingresa tu cédula"
              pattern="[0-9]{6,10}"
            />
          </div>

          <button
            @click="autenticar"
            class="btn btn-primary btn-large"
            :disabled="!cedula || loading"
          >
            {{ loading ? "Procesando..." : "😊 Autenticar con Face ID" }}
          </button>
        </div>

        <div v-if="loading" class="loading-section">
          <div class="face-animation">👤</div>
          <p>Mira a la cámara...</p>
        </div>

        <div v-if="resultado" class="resultado-card" :class="resultado.tipo">
          <div class="resultado-icon">
            {{ resultado.tipo === "success" ? "✅" : "❌" }}
          </div>
          <h3>{{ resultado.titulo }}</h3>
          <p>{{ resultado.mensaje }}</p>
          <div v-if="resultado.data" class="resultado-detalles">
            <p><strong>Estudiante:</strong> {{ resultado.data.nombre }}</p>
            <p><strong>Hora:</strong> {{ resultado.data.horaLlegada }}</p>
            <p v-if="resultado.data.esRetardo" class="retardo-info">
              ⚠️ Llegada tarde: {{ resultado.data.minutosRetardo }} minutos
            </p>
          </div>
          <button @click="resetear" class="btn btn-primary mt-3">
            🔄 Nuevo Registro
          </button>
        </div>
      </div>

      <div class="info-card card">
        <h3>ℹ️ Información sobre Face ID</h3>
        <ul>
          <li>
            Compatible con Face ID en dispositivos iOS (iPhone X y posteriores)
          </li>
          <li>
            También funciona con Windows Hello en PC con cámara compatible
          </li>
          <li>Usa la Web Authentication API para máxima seguridad</li>
          <li>Tus datos faciales nunca salen de tu dispositivo</li>
          <li>
            Es necesario registrar tu rostro previamente con un administrador
          </li>
          <li>
            Asegúrate de tener buena iluminación para mejor reconocimiento
          </li>
        </ul>
      </div>

      <div class="compatibility-card card">
        <h3>📱 Compatibilidad</h3>
        <div class="compatibility-grid">
          <div class="compat-item">
            <div class="compat-icon">🍎</div>
            <h4>iOS</h4>
            <p>Safari con Face ID</p>
          </div>
          <div class="compat-item">
            <div class="compat-icon">🤖</div>
            <h4>Android</h4>
            <p>Chrome con reconocimiento facial</p>
          </div>
          <div class="compat-item">
            <div class="compat-icon">💻</div>
            <h4>Windows</h4>
            <p>Edge con Windows Hello</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  autenticarConFaceId,
  soportaWebAuthn as checkWebAuthn,
} from "../utils/webauthn";

const soportado = ref(false);
const cedula = ref("");
const loading = ref(false);
const resultado = ref(null);

onMounted(() => {
  soportado.value = checkWebAuthn();
});

function obtenerInfoDispositivo() {
  const ua = navigator.userAgent;
  let tipo = "Web";
  let sistemaOperativo = "Desconocido";

  if (/iPhone|iPad|iPod/.test(ua)) {
    tipo = "iOS";
    sistemaOperativo = "iOS";
  } else if (/Android/.test(ua)) {
    tipo = "Android";
    sistemaOperativo = "Android";
  } else if (/Windows/.test(ua)) {
    sistemaOperativo = "Windows";
  } else if (/Mac/.test(ua)) {
    sistemaOperativo = "macOS";
  } else if (/Linux/.test(ua)) {
    sistemaOperativo = "Linux";
  }

  return {
    tipo,
    navegador: obtenerNavegador(),
    sistemaOperativo,
  };
}

function obtenerNavegador() {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  return "Desconocido";
}

const autenticar = async () => {
  if (!cedula.value) {
    alert("Por favor ingresa tu cédula");
    return;
  }

  if (!soportado.value) {
    resultado.value = {
      tipo: "error",
      titulo: "No Soportado",
      mensaje: "Tu navegador no soporta autenticación biométrica (WebAuthn)",
    };
    return;
  }

  loading.value = true;
  resultado.value = null;

  try {
    const dispositivo = obtenerInfoDispositivo();
    const response = await autenticarConFaceId(cedula.value, dispositivo);

    resultado.value = {
      tipo: "success",
      titulo: "¡Reconocimiento Exitoso!",
      mensaje: response.message,
      data: response.data,
    };

    cedula.value = "";
  } catch (error) {
    console.error("Error en autenticación Face ID:", error);
    resultado.value = {
      tipo: "error",
      titulo: "Error de Reconocimiento",
      mensaje:
        error.response?.data?.message ||
        error.message ||
        "No se pudo autenticar. Asegúrate de tener tu Face ID registrado primero.",
    };
  } finally {
    loading.value = false;
  }
};

const resetear = () => {
  resultado.value = null;
  cedula.value = "";
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.auth-card {
  text-align: center;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
}

.icon-large {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.warning-message {
  background-color: #fff3cd;
  color: #856404;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
  border: 2px solid #ffc107;
}

.form-section {
  max-width: 400px;
  margin: 2rem auto;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.25rem;
  width: 100%;
  margin-top: 1rem;
}

.loading-section {
  margin: 2rem 0;
}

.face-animation {
  font-size: 5rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

.resultado-card {
  margin-top: 2rem;
  padding: 2rem;
  border-radius: 12px;
}

.resultado-card.success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border: 2px solid var(--success-color);
}

.resultado-card.error {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border: 2px solid var(--danger-color);
}

.resultado-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.resultado-detalles {
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}

.resultado-detalles p {
  margin: 0.5rem 0;
}

.retardo-info {
  color: var(--warning-color);
  font-weight: 600;
  font-size: 1.1rem;
}

.info-card,
.compatibility-card {
  margin-top: 2rem;
}

.info-card ul {
  text-align: left;
  padding-left: 1.5rem;
}

.info-card li {
  margin: 0.75rem 0;
  line-height: 1.6;
}

.compatibility-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.compat-item {
  text-align: center;
  padding: 1.5rem;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.compat-item:hover {
  transform: translateY(-5px);
}

.compat-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.compat-item h4 {
  margin: 0.5rem 0;
  color: var(--primary-color);
}

.compat-item p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .auth-card {
    padding: 2rem 1rem;
  }

  .icon-large {
    font-size: 3rem;
  }

  .compatibility-grid {
    grid-template-columns: 1fr;
  }
}
</style>

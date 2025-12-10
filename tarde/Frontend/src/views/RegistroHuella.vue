<template>
  <div class="registro-huella">
    <div class="container">
      <div class="header">
        <h1>👆 Registro por Huella Dactilar</h1>
        <router-link to="/" class="btn btn-outline">← Volver</router-link>
      </div>

      <div class="auth-card card">
        <div class="icon-large">🔐</div>
        <h2>Autenticación Biométrica</h2>
        <p>Usa tu huella dactilar para registrar tu llegada</p>

        <div v-if="!soportado" class="warning-message">
          ⚠️ Tu navegador no soporta autenticación biométrica.
          <br />Por favor, usa Chrome, Edge o Safari en un dispositivo
          compatible.
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
            {{ loading ? "Procesando..." : "👆 Autenticar con Huella" }}
          </button>
        </div>

        <div v-if="loading" class="loading-section">
          <div class="spinner"></div>
          <p>Coloca tu dedo en el sensor...</p>
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
        <h3>ℹ️ Información</h3>
        <ul>
          <li>
            La autenticación biométrica usa la Web Authentication API (WebAuthn)
          </li>
          <li>
            Compatible con sensores de huella en dispositivos Android e iOS
          </li>
          <li>También funciona con Windows Hello y Touch ID en Mac</li>
          <li>Tus datos biométricos nunca salen de tu dispositivo</li>
          <li>
            Es necesario registrar tu huella previamente con un administrador
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  autenticarConHuella,
  soportaWebAuthn as checkWebAuthn,
} from "../utils/webauthn";

const soportado = ref(false);
const cedula = ref("");
const loading = ref(false);
const resultado = ref(null);

onMounted(() => {
  // Verificar soporte de WebAuthn
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
    const response = await autenticarConHuella(cedula.value, dispositivo);

    resultado.value = {
      tipo: "success",
      titulo: "¡Autenticación Exitosa!",
      mensaje: response.message,
      data: response.data,
    };

    cedula.value = "";
  } catch (error) {
    console.error("Error en autenticación:", error);
    resultado.value = {
      tipo: "error",
      titulo: "Error de Autenticación",
      mensaje:
        error.response?.data?.message ||
        error.message ||
        "No se pudo autenticar. Asegúrate de tener tu huella registrada primero.",
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

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--bg-secondary);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
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

.info-card {
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
}
</style>

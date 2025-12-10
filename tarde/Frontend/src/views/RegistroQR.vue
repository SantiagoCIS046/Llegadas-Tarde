<template>
  <div class="registro-qr">
    <div class="container">
      <div class="header">
        <h1>📱 Registro por Código QR</h1>
        <router-link to="/" class="btn btn-outline">← Volver</router-link>
      </div>

      <div class="scanner-card card">
        <div v-if="!scanning" class="start-section">
          <div class="icon-large">📷</div>
          <h2>Escanear Código QR</h2>
          <p>
            Presiona el botón para activar la cámara y escanear tu código QR
          </p>
          <button @click="iniciarEscaneo" class="btn btn-primary btn-large">
            🎥 Activar Cámara
          </button>
        </div>

        <div v-else class="scanner-section">
          <div id="qr-reader" class="qr-reader"></div>
          <button @click="detenerEscaneo" class="btn btn-danger mt-3">
            ⏹️ Detener Escaneo
          </button>
        </div>

        <div v-if="loading" class="loading-overlay">
          <div class="spinner"></div>
          <p>Procesando registro...</p>
        </div>
      </div>

      <div v-if="resultado" class="resultado-card card" :class="resultado.tipo">
        <div class="resultado-icon">
          {{ resultado.tipo === "success" ? "✅" : "❌" }}
        </div>
        <h3>{{ resultado.titulo }}</h3>
        <p>{{ resultado.mensaje }}</p>
        <div v-if="resultado.data" class="resultado-detalles">
          <p><strong>Estudiante:</strong> {{ resultado.data.nombre }}</p>
          <p><strong>Cédula:</strong> {{ resultado.data.cedula }}</p>
          <p><strong>Hora:</strong> {{ resultado.data.horaLlegada }}</p>
          <p v-if="resultado.data.esRetardo" class="retardo-info">
            ⚠️ Llegada tarde: {{ resultado.data.minutosRetardo }} minutos
          </p>
        </div>
        <button @click="resetear" class="btn btn-primary mt-3">
          🔄 Escanear Otro
        </button>
      </div>

      <div class="instrucciones card">
        <h3>📋 Instrucciones</h3>
        <ol>
          <li>Presiona "Activar Cámara" para iniciar el escaneo</li>
          <li>Permite el acceso a la cámara cuando el navegador lo solicite</li>
          <li>Coloca el código QR frente a la cámara</li>
          <li>El sistema registrará automáticamente tu llegada</li>
          <li>Verás una confirmación con los detalles del registro</li>
        </ol>
        <p class="nota">
          <strong>Nota:</strong> Asegúrate de tener buena iluminación para un
          escaneo exitoso
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { Html5Qrcode } from "html5-qrcode";
import { useRegistrosStore } from "../stores/registros";

const store = useRegistrosStore();
const scanning = ref(false);
const loading = ref(false);
const resultado = ref(null);
let html5QrCode = null;

const iniciarEscaneo = async () => {
  try {
    html5QrCode = new Html5Qrcode("qr-reader");

    await html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      onScanSuccess,
      onScanError
    );

    scanning.value = true;
  } catch (err) {
    alert("Error al acceder a la cámara: " + err);
  }
};

const detenerEscaneo = async () => {
  if (html5QrCode) {
    await html5QrCode.stop();
    scanning.value = false;
  }
};

const onScanSuccess = async (decodedText) => {
  loading.value = true;
  await detenerEscaneo();

  try {
    const response = await store.registrarPorQR(decodedText);
    resultado.value = {
      tipo: "success",
      titulo: "¡Registro Exitoso!",
      mensaje: response.message,
      data: response.data,
    };
  } catch (error) {
    resultado.value = {
      tipo: "error",
      titulo: "Error en el Registro",
      mensaje:
        error.response?.data?.message || "No se pudo completar el registro",
    };
  } finally {
    loading.value = false;
  }
};

const onScanError = (error) => {
  // Ignorar errores de escaneo continuo
};

const resetear = () => {
  resultado.value = null;
  scanning.value = false;
};

onUnmounted(() => {
  if (html5QrCode && scanning.value) {
    html5QrCode.stop();
  }
});
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

.scanner-card {
  position: relative;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.start-section {
  text-align: center;
  padding: 2rem;
}

.icon-large {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.25rem;
  margin-top: 1.5rem;
}

.qr-reader {
  width: 100%;
  max-width: 500px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--bg-secondary);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.resultado-card {
  text-align: center;
  padding: 2rem;
  margin-top: 2rem;
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

.instrucciones {
  margin-top: 2rem;
}

.instrucciones ol {
  text-align: left;
  padding-left: 1.5rem;
}

.instrucciones li {
  margin: 0.75rem 0;
  line-height: 1.6;
}

.nota {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .icon-large {
    font-size: 3rem;
  }
}
</style>

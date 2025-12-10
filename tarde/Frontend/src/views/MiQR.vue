<template>
  <div class="mi-qr">
    <div class="container">
      <div class="header">
        <h1>📱 Mi Código QR</h1>
        <router-link to="/" class="btn btn-outline">← Volver</router-link>
      </div>

      <div v-if="!qrGenerado" class="form-card card">
        <h2>Generar Mi Código QR</h2>
        <p class="info-text">
          Ingresa tu cédula para generar tu código QR personal. Podrás usarlo
          para registrar tus llegadas escaneándolo desde otro dispositivo.
        </p>

        <div class="form-group">
          <label class="form-label">Cédula</label>
          <input
            v-model="cedula"
            type="text"
            class="form-control"
            placeholder="Ingresa tu cédula"
            @keyup.enter="generarMiQR"
          />
        </div>

        <button
          @click="generarMiQR"
          class="btn btn-primary btn-large"
          :disabled="loading"
        >
          {{ loading ? "Generando..." : "🎫 Generar Mi QR" }}
        </button>
      </div>

      <div v-if="qrGenerado" class="qr-display-card card">
        <div class="estudiante-info">
          <h2>{{ estudiante.nombre }}</h2>
          <p><strong>Cédula:</strong> {{ estudiante.cedula }}</p>
          <p><strong>Ficha:</strong> {{ estudiante.numeroFicha }}</p>
        </div>

        <div class="qr-display">
          <div class="qr-wrapper">
            <img :src="qrImage" alt="Mi Código QR" class="qr-image" />
          </div>
          <p class="qr-instruction">
            📸 Escanea este código desde otro dispositivo para registrar tu
            llegada
          </p>
        </div>

        <div class="action-buttons">
          <button @click="descargarQR" class="btn btn-secondary">
            💾 Descargar QR
          </button>
          <button
            @click="compartirQR"
            class="btn btn-secondary"
            v-if="puedeCompartir"
          >
            📤 Compartir
          </button>
          <button @click="resetear" class="btn btn-outline">
            🔄 Generar Otro
          </button>
        </div>

        <div class="tips-card">
          <h3>💡 Consejos</h3>
          <ul>
            <li>
              Guarda este QR en tu galería para usarlo cuando lo necesites
            </li>
            <li>Asegúrate de tener buena iluminación al escanear</li>
            <li>Mantén el código QR limpio y sin arrugas</li>
            <li>Puedes imprimir este código si lo prefieres</li>
          </ul>
        </div>
      </div>

      <div v-if="error" class="error-card card">
        <div class="error-icon">❌</div>
        <h3>Error</h3>
        <p>{{ error }}</p>
        <button @click="resetear" class="btn btn-primary mt-2">
          🔄 Intentar de Nuevo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useEstudiantesStore } from "../stores/estudiantes";

const estudiantesStore = useEstudiantesStore();

const cedula = ref("");
const loading = ref(false);
const qrGenerado = ref(false);
const qrImage = ref("");
const estudiante = ref(null);
const error = ref(null);
const puedeCompartir = ref(false);

onMounted(() => {
  // Verificar si el navegador soporta Web Share API
  puedeCompartir.value = navigator.share !== undefined;
});

async function generarMiQR() {
  if (!cedula.value) {
    alert("Por favor ingresa tu cédula");
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // Buscar estudiante por cédula
    const est = await estudiantesStore.buscarPorCedula(cedula.value);
    estudiante.value = est;

    // Generar QR
    const response = await estudiantesStore.generarQR(est._id);
    qrImage.value = response.data.qrImage;
    qrGenerado.value = true;
  } catch (err) {
    console.error("Error generando QR:", err);
    error.value =
      err.response?.data?.message ||
      "No se pudo generar el QR. Verifica que tu cédula esté registrada.";
  } finally {
    loading.value = false;
  }
}

function descargarQR() {
  const link = document.createElement("a");
  link.href = qrImage.value;
  link.download = `QR-${estudiante.value.cedula}.png`;
  link.click();
}

async function compartirQR() {
  try {
    // Convertir data URL a blob
    const response = await fetch(qrImage.value);
    const blob = await response.blob();
    const file = new File([blob], `QR-${estudiante.value.cedula}.png`, {
      type: "image/png",
    });

    await navigator.share({
      title: "Mi Código QR - LlegadasTarde",
      text: `Código QR de ${estudiante.value.nombre}`,
      files: [file],
    });
  } catch (err) {
    console.error("Error compartiendo:", err);
    // Si falla, intentar descargar
    descargarQR();
  }
}

function resetear() {
  qrGenerado.value = false;
  error.value = null;
  cedula.value = "";
  qrImage.value = "";
  estudiante.value = null;
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.form-card {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

.info-text {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.qr-display-card {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.estudiante-info {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.estudiante-info h2 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.estudiante-info p {
  margin: 0.5rem 0;
  color: var(--text-primary);
}

.qr-display {
  margin: 2rem 0;
}

.qr-wrapper {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: inline-block;
  margin-bottom: 1rem;
}

.qr-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  display: block;
}

.qr-instruction {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-top: 1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0;
}

.tips-card {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  text-align: left;
}

.tips-card h3 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.tips-card ul {
  margin: 0;
  padding-left: 1.5rem;
}

.tips-card li {
  margin: 0.5rem 0;
  color: var(--text-primary);
  line-height: 1.6;
}

.error-card {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  border: 2px solid var(--danger-color);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }

  .qr-wrapper {
    padding: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons button {
    width: 100%;
  }
}
</style>

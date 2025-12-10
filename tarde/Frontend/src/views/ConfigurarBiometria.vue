<template>
  <div class="configurar-biometria">
    <div class="container">
      <div class="header">
        <h1>🔐 Configurar Autenticación Biométrica</h1>
        <router-link to="/estudiantes" class="btn btn-outline"
          >← Volver</router-link
        >
      </div>

      <div class="info-card card">
        <h3>ℹ️ Información</h3>
        <p>
          Antes de poder usar la autenticación biométrica para registrar
          llegadas, debes configurar tu huella dactilar o Face ID.
        </p>
        <p>Este proceso solo necesita hacerse una vez por estudiante.</p>
      </div>

      <div class="form-card card">
        <h2>Buscar Estudiante</h2>
        <div class="form-group">
          <label class="form-label">Cédula del Estudiante</label>
          <input
            v-model="cedula"
            type="text"
            class="form-control"
            placeholder="Ingresa la cédula"
            @keyup.enter="buscarEstudiante"
          />
        </div>
        <button
          @click="buscarEstudiante"
          class="btn btn-primary"
          :disabled="loading"
        >
          🔍 Buscar Estudiante
        </button>
      </div>

      <div v-if="estudiante" class="estudiante-card card">
        <h3>👤 Estudiante Encontrado</h3>
        <p><strong>Nombre:</strong> {{ estudiante.nombre }}</p>
        <p><strong>Cédula:</strong> {{ estudiante.cedula }}</p>
        <p><strong>Ficha:</strong> {{ estudiante.numeroFicha }}</p>

        <div class="biometria-options">
          <div class="option-card">
            <h4>👆 Huella Dactilar</h4>
            <p v-if="estudiante.huellaRegistrada" class="status-registered">
              ✅ Ya registrada
            </p>
            <p v-else class="status-not-registered">❌ No registrada</p>
            <button
              @click="registrarHuella"
              class="btn btn-secondary"
              :disabled="loading || !soportaWebAuthn"
            >
              {{
                estudiante.huellaRegistrada ? "Actualizar" : "Registrar"
              }}
              Huella
            </button>
          </div>

          <div class="option-card">
            <h4>😊 Face ID</h4>
            <p v-if="estudiante.faceIdRegistrado" class="status-registered">
              ✅ Ya registrado
            </p>
            <p v-else class="status-not-registered">❌ No registrado</p>
            <button
              @click="registrarFaceId"
              class="btn btn-secondary"
              :disabled="loading || !soportaWebAuthn"
            >
              {{
                estudiante.faceIdRegistrado ? "Actualizar" : "Registrar"
              }}
              Face ID
            </button>
          </div>
        </div>
      </div>

      <div v-if="resultado" class="resultado-card card" :class="resultado.tipo">
        <div class="resultado-icon">
          {{ resultado.tipo === "success" ? "✅" : "❌" }}
        </div>
        <h3>{{ resultado.titulo }}</h3>
        <p>{{ resultado.mensaje }}</p>
        <button @click="resetear" class="btn btn-primary mt-3">
          🔄 Configurar Otro
        </button>
      </div>

      <div v-if="!soportaWebAuthn" class="warning-card card">
        <h3>⚠️ Advertencia</h3>
        <p>
          Tu navegador no soporta WebAuthn. Por favor usa un navegador moderno
          como Chrome, Edge, Safari o Firefox.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useEstudiantesStore } from "../stores/estudiantes";
import {
  registrarHuella as registrarHuellaWebAuthn,
  registrarFaceId as registrarFaceIdWebAuthn,
  soportaWebAuthn as checkWebAuthn,
} from "../utils/webauthn";

const estudiantesStore = useEstudiantesStore();

const cedula = ref("");
const estudiante = ref(null);
const loading = ref(false);
const resultado = ref(null);
const soportaWebAuthn = ref(false);

onMounted(() => {
  soportaWebAuthn.value = checkWebAuthn();
});

async function buscarEstudiante() {
  if (!cedula.value) {
    alert("Por favor ingresa una cédula");
    return;
  }

  loading.value = true;
  resultado.value = null;

  try {
    const est = await estudiantesStore.buscarPorCedula(cedula.value);
    estudiante.value = est;
  } catch (error) {
    alert(error.response?.data?.message || "Estudiante no encontrado");
    estudiante.value = null;
  } finally {
    loading.value = false;
  }
}

async function registrarHuella() {
  if (!estudiante.value) return;

  loading.value = true;
  resultado.value = null;

  try {
    const response = await registrarHuellaWebAuthn(estudiante.value.cedula);

    resultado.value = {
      tipo: "success",
      titulo: "¡Huella Registrada!",
      mensaje: response.message,
    };

    // Actualizar estado del estudiante
    estudiante.value.huellaRegistrada = true;
  } catch (error) {
    console.error("Error registrando huella:", error);
    resultado.value = {
      tipo: "error",
      titulo: "Error",
      mensaje:
        error.response?.data?.message ||
        error.message ||
        "No se pudo registrar la huella",
    };
  } finally {
    loading.value = false;
  }
}

async function registrarFaceId() {
  if (!estudiante.value) return;

  loading.value = true;
  resultado.value = null;

  try {
    const response = await registrarFaceIdWebAuthn(estudiante.value.cedula);

    resultado.value = {
      tipo: "success",
      titulo: "¡Face ID Registrado!",
      mensaje: response.message,
    };

    // Actualizar estado del estudiante
    estudiante.value.faceIdRegistrado = true;
  } catch (error) {
    console.error("Error registrando Face ID:", error);
    resultado.value = {
      tipo: "error",
      titulo: "Error",
      mensaje:
        error.response?.data?.message ||
        error.message ||
        "No se pudo registrar Face ID",
    };
  } finally {
    loading.value = false;
  }
}

function resetear() {
  resultado.value = null;
  estudiante.value = null;
  cedula.value = "";
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.info-card {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  margin-bottom: 2rem;
}

.form-card {
  margin-bottom: 2rem;
}

.estudiante-card {
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #f3e5f5, #e1bee7);
}

.biometria-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.option-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.option-card h4 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.status-registered {
  color: var(--success-color);
  font-weight: 600;
  margin-bottom: 1rem;
}

.status-not-registered {
  color: var(--danger-color);
  font-weight: 600;
  margin-bottom: 1rem;
}

.resultado-card {
  text-align: center;
  padding: 2rem;
  margin-bottom: 2rem;
}

.resultado-card.success {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  border: 2px solid var(--success-color);
}

.resultado-card.error {
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  border: 2px solid var(--danger-color);
}

.resultado-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.warning-card {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border: 2px solid var(--warning-color);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
  }

  .biometria-options {
    grid-template-columns: 1fr;
  }
}
</style>

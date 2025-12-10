<template>
  <div class="estudiantes">
    <div class="container">
      <div class="header">
        <h1>👥 Gestión de Estudiantes</h1>
        <router-link to="/estudiantes/nuevo" class="btn btn-primary">
          ➕ Nuevo Estudiante
        </router-link>
      </div>

      <div class="filters card">
        <div class="filter-group">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre o cédula..."
            class="form-control"
            @input="buscar"
          />
        </div>
        <div class="filter-group">
          <input
            v-model="fichaFilter"
            type="text"
            placeholder="Filtrar por ficha..."
            class="form-control"
            @input="buscar"
          />
        </div>
      </div>

      <div v-if="store.loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando estudiantes...</p>
      </div>

      <div v-else-if="store.error" class="error-message card">
        ❌ {{ store.error }}
      </div>

      <div v-else-if="store.estudiantes.length === 0" class="empty-state card">
        <p>📭 No hay estudiantes registrados</p>
        <router-link to="/estudiantes/nuevo" class="btn btn-primary mt-2">
          Registrar primer estudiante
        </router-link>
      </div>

      <div v-else class="table-container card">
        <table class="students-table">
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Ficha</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="estudiante in store.estudiantes" :key="estudiante._id">
              <td>{{ estudiante.cedula }}</td>
              <td>{{ estudiante.nombre }}</td>
              <td>
                <span class="badge">{{ estudiante.numeroFicha }}</span>
              </td>
              <td>{{ estudiante.email || "N/A" }}</td>
              <td>{{ estudiante.telefono || "N/A" }}</td>
              <td class="actions">
                <button
                  @click="generarQR(estudiante)"
                  class="btn-icon"
                  title="Generar QR"
                >
                  📱
                </button>
                <button
                  @click="eliminar(estudiante)"
                  class="btn-icon danger"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="store.totalPages > 1" class="pagination">
        <button
          @click="cambiarPagina(store.currentPage - 1)"
          :disabled="store.currentPage === 1"
          class="btn btn-outline"
        >
          ← Anterior
        </button>
        <span class="page-info">
          Página {{ store.currentPage }} de {{ store.totalPages }}
        </span>
        <button
          @click="cambiarPagina(store.currentPage + 1)"
          :disabled="store.currentPage === store.totalPages"
          class="btn btn-outline"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Modal QR -->
    <div v-if="showQRModal" class="modal" @click="closeQRModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeQRModal">✕</button>
        <h2>Código QR - {{ qrData.estudiante?.nombre }}</h2>
        <div class="qr-container">
          <img :src="qrData.qrImage" alt="QR Code" class="qr-image" />
        </div>
        <p class="qr-info">Cédula: {{ qrData.estudiante?.cedula }}</p>
        <p class="qr-info">Ficha: {{ qrData.estudiante?.numeroFicha }}</p>
        <button @click="descargarQR" class="btn btn-primary mt-2">
          💾 Descargar QR
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useEstudiantesStore } from "../stores/estudiantes";

const store = useEstudiantesStore();
const searchQuery = ref("");
const fichaFilter = ref("");
const showQRModal = ref(false);
const qrData = ref({});

onMounted(() => {
  cargarEstudiantes();
});

const cargarEstudiantes = async () => {
  try {
    await store.obtenerEstudiantes({
      page: 1,
      limit: 10,
      search: searchQuery.value,
      ficha: fichaFilter.value,
    });
  } catch (error) {
    console.error("Error al cargar estudiantes:", error);
  }
};

const buscar = () => {
  cargarEstudiantes();
};

const cambiarPagina = (page) => {
  store.obtenerEstudiantes({
    page,
    limit: 10,
    search: searchQuery.value,
    ficha: fichaFilter.value,
  });
};

const generarQR = async (estudiante) => {
  try {
    const response = await store.generarQR(estudiante._id);
    qrData.value = response.data;
    showQRModal.value = true;
  } catch (error) {
    alert("Error al generar QR: " + error.message);
  }
};

const closeQRModal = () => {
  showQRModal.value = false;
  qrData.value = {};
};

const descargarQR = () => {
  const link = document.createElement("a");
  link.href = qrData.value.qrImage;
  link.download = `QR-${qrData.value.estudiante.cedula}.png`;
  link.click();
};

const eliminar = async (estudiante) => {
  if (confirm(`¿Estás seguro de eliminar a ${estudiante.nombre}?`)) {
    try {
      await store.eliminarEstudiante(estudiante._id);
      alert("Estudiante eliminado exitosamente");
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
  }
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

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  padding: 3rem;
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

.error-message,
.empty-state {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.table-container {
  overflow-x: auto;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
}

.students-table th,
.students-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.students-table th {
  background-color: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
}

.students-table tr:hover {
  background-color: var(--bg-secondary);
}

.badge {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  transition: transform 0.2s;
}

.btn-icon:hover {
  transform: scale(1.2);
}

.btn-icon.danger:hover {
  filter: brightness(0.8);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-info {
  font-weight: 500;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  position: relative;
  text-align: center;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.qr-container {
  margin: 2rem 0;
}

.qr-image {
  max-width: 300px;
  width: 100%;
  height: auto;
}

.qr-info {
  margin: 0.5rem 0;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .students-table {
    font-size: 0.875rem;
  }

  .students-table th,
  .students-table td {
    padding: 0.5rem;
  }
}
</style>

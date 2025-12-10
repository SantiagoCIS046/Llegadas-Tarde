<template>
  <div class="registros">
    <div class="container">
      <h1>📋 Historial de Registros</h1>

      <div class="filters card">
        <div class="filter-row">
          <div class="filter-group">
            <label class="form-label">Fecha Inicio</label>
            <input
              v-model="filtros.fechaInicio"
              type="date"
              class="form-control"
            />
          </div>
          <div class="filter-group">
            <label class="form-label">Fecha Fin</label>
            <input
              v-model="filtros.fechaFin"
              type="date"
              class="form-control"
            />
          </div>
          <div class="filter-group">
            <label class="form-label">Ficha</label>
            <input
              v-model="filtros.ficha"
              type="text"
              class="form-control"
              placeholder="Número de ficha"
            />
          </div>
          <div class="filter-group">
            <label class="form-label">Método</label>
            <select v-model="filtros.metodo" class="form-control">
              <option value="">Todos</option>
              <option value="QR">QR</option>
              <option value="HUELLA">Huella</option>
              <option value="FACEID">Face ID</option>
            </select>
          </div>
        </div>
        <div class="filter-actions">
          <button @click="aplicarFiltros" class="btn btn-primary">
            🔍 Buscar
          </button>
          <button @click="limpiarFiltros" class="btn btn-outline">
            🔄 Limpiar
          </button>
        </div>
      </div>

      <div v-if="store.loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando registros...</p>
      </div>

      <div v-else-if="store.registros.length === 0" class="empty-state card">
        <p>📭 No hay registros para mostrar</p>
      </div>

      <div v-else class="table-container card">
        <table class="registros-table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Estudiante</th>
              <th>Cédula</th>
              <th>Ficha</th>
              <th>Hora Llegada</th>
              <th>Método</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="registro in store.registros" :key="registro._id">
              <td>{{ formatearFecha(registro.fechaHora) }}</td>
              <td>{{ registro.nombre }}</td>
              <td>{{ registro.cedula }}</td>
              <td>
                <span class="badge">{{ registro.numeroFicha }}</span>
              </td>
              <td>{{ registro.horaLlegada }}</td>
              <td>
                <span class="badge-metodo" :class="registro.metodoRegistro">{{
                  registro.metodoRegistro
                }}</span>
              </td>
              <td>
                <span v-if="registro.esRetardo" class="badge-retardo">
                  ⚠️ Retardo ({{ registro.minutosRetardo }} min)
                </span>
                <span v-else class="badge-atiempo">✅ A tiempo</span>
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
        <span class="page-info"
          >Página {{ store.currentPage }} de {{ store.totalPages }}</span
        >
        <button
          @click="cambiarPagina(store.currentPage + 1)"
          :disabled="store.currentPage === store.totalPages"
          class="btn btn-outline"
        >
          Siguiente →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRegistrosStore } from "../stores/registros";

const store = useRegistrosStore();

const filtros = ref({
  fechaInicio: "",
  fechaFin: "",
  ficha: "",
  metodo: "",
});

onMounted(() => {
  cargarRegistros();
});

const cargarRegistros = async () => {
  const params = {
    page: 1,
    limit: 20,
  };

  if (filtros.value.fechaInicio) params.fechaInicio = filtros.value.fechaInicio;
  if (filtros.value.fechaFin) params.fechaFin = filtros.value.fechaFin;
  if (filtros.value.ficha) params.ficha = filtros.value.ficha;
  if (filtros.value.metodo) params.metodo = filtros.value.metodo;

  await store.obtenerRegistros(params);
};

const aplicarFiltros = () => {
  cargarRegistros();
};

const limpiarFiltros = () => {
  filtros.value = {
    fechaInicio: "",
    fechaFin: "",
    ficha: "",
    metodo: "",
  };
  cargarRegistros();
};

const cambiarPagina = (page) => {
  store.obtenerRegistros({ ...filtros.value, page, limit: 20 });
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleString("es-CO");
};
</script>

<style scoped>
.filters {
  margin-bottom: 2rem;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-actions {
  display: flex;
  gap: 1rem;
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

.empty-state {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.table-container {
  overflow-x: auto;
}

.registros-table {
  width: 100%;
  border-collapse: collapse;
}

.registros-table th,
.registros-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.registros-table th {
  background-color: var(--bg-secondary);
  font-weight: 600;
}

.registros-table tr:hover {
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

.badge-metodo {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
}

.badge-metodo.QR {
  background-color: #0066cc;
}

.badge-metodo.HUELLA {
  background-color: #ff6b00;
}

.badge-metodo.FACEID {
  background-color: #9c27b0;
}

.badge-retardo {
  background-color: #ffc107;
  color: #000;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-atiempo {
  background-color: #28a745;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
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

@media (max-width: 768px) {
  .filter-row {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    flex-direction: column;
  }

  .registros-table {
    font-size: 0.875rem;
  }

  .registros-table th,
  .registros-table td {
    padding: 0.5rem;
  }
}
</style>

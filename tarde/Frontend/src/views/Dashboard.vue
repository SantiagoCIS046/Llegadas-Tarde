<template>
  <div class="dashboard">
    <div class="container">
      <h1>📊 Dashboard - Estadísticas</h1>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando estadísticas...</p>
      </div>

      <div v-else-if="estadisticas" class="dashboard-content">
        <div class="stats-grid">
          <div class="stat-card card">
            <div class="stat-icon">📝</div>
            <div class="stat-info">
              <h3>{{ estadisticas.totalHoy }}</h3>
              <p>Registros Hoy</p>
            </div>
          </div>

          <div class="stat-card card success">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h3>{{ estadisticas.aTiempoHoy }}</h3>
              <p>A Tiempo</p>
            </div>
          </div>

          <div class="stat-card card warning">
            <div class="stat-icon">⚠️</div>
            <div class="stat-info">
              <h3>{{ estadisticas.retardosHoy }}</h3>
              <p>Llegadas Tarde</p>
            </div>
          </div>

          <div class="stat-card card info">
            <div class="stat-icon">📈</div>
            <div class="stat-info">
              <h3>{{ calcularPorcentajePuntualidad() }}%</h3>
              <p>Puntualidad</p>
            </div>
          </div>
        </div>

        <div class="charts-section">
          <div class="chart-card card">
            <h2>📊 Registros por Método</h2>
            <div class="method-stats">
              <div
                v-for="metodo in estadisticas.porMetodo"
                :key="metodo._id"
                class="method-item"
              >
                <div class="method-bar">
                  <div
                    class="method-fill"
                    :class="metodo._id"
                    :style="{ width: calcularPorcentaje(metodo.count) + '%' }"
                  ></div>
                </div>
                <div class="method-info">
                  <span class="method-name">{{ metodo._id }}</span>
                  <span class="method-count">{{ metodo.count }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-card card">
            <h2>⏰ Resumen del Día</h2>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-label">Total de Registros</div>
                <div class="summary-value">{{ estadisticas.totalHoy }}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Estudiantes Puntuales</div>
                <div class="summary-value success">
                  {{ estadisticas.aTiempoHoy }}
                </div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Estudiantes con Retardo</div>
                <div class="summary-value warning">
                  {{ estadisticas.retardosHoy }}
                </div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Tasa de Puntualidad</div>
                <div class="summary-value info">
                  {{ calcularPorcentajePuntualidad() }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="actions-section">
          <router-link to="/estudiantes" class="btn btn-primary">
            👥 Ver Estudiantes
          </router-link>
          <router-link to="/registros" class="btn btn-secondary">
            📋 Ver Todos los Registros
          </router-link>
          <button @click="actualizarEstadisticas" class="btn btn-success">
            🔄 Actualizar Datos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRegistrosStore } from "../stores/registros";

const store = useRegistrosStore();
const loading = ref(true);
const estadisticas = ref(null);

onMounted(async () => {
  await cargarEstadisticas();
});

const cargarEstadisticas = async () => {
  loading.value = true;
  try {
    estadisticas.value = await store.obtenerEstadisticas();
  } catch (error) {
    console.error("Error al cargar estadísticas:", error);
  } finally {
    loading.value = false;
  }
};

const actualizarEstadisticas = () => {
  cargarEstadisticas();
};

const calcularPorcentajePuntualidad = () => {
  if (!estadisticas.value || estadisticas.value.totalHoy === 0) return 0;
  return Math.round(
    (estadisticas.value.aTiempoHoy / estadisticas.value.totalHoy) * 100
  );
};

const calcularPorcentaje = (count) => {
  if (!estadisticas.value || estadisticas.value.totalHoy === 0) return 0;
  return Math.round((count / estadisticas.value.totalHoy) * 100);
};
</script>

<style scoped>
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card.success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-left: 4px solid var(--success-color);
}

.stat-card.warning {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-left: 4px solid var(--warning-color);
}

.stat-card.info {
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  border-left: 4px solid #17a2b8;
}

.stat-icon {
  font-size: 3rem;
}

.stat-info h3 {
  font-size: 2.5rem;
  margin: 0;
  color: var(--primary-color);
}

.stat-info p {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
  font-weight: 500;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-card {
  padding: 2rem;
}

.chart-card h2 {
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.method-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.method-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.method-bar {
  height: 30px;
  background-color: var(--bg-secondary);
  border-radius: 15px;
  overflow: hidden;
}

.method-fill {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 15px;
}

.method-fill.QR {
  background: linear-gradient(90deg, #0066cc, #0088ff);
}

.method-fill.HUELLA {
  background: linear-gradient(90deg, #ff6b00, #ff8c42);
}

.method-fill.FACEID {
  background: linear-gradient(90deg, #9c27b0, #ba68c8);
}

.method-info {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
}

.method-name {
  color: var(--text-primary);
}

.method-count {
  color: var(--primary-color);
  font-weight: 600;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.summary-item {
  text-align: center;
  padding: 1.5rem;
  background-color: var(--bg-secondary);
  border-radius: 12px;
}

.summary-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.summary-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.summary-value.success {
  color: var(--success-color);
}

.summary-value.warning {
  color: var(--warning-color);
}

.summary-value.info {
  color: #17a2b8;
}

.actions-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .stat-info h3 {
    font-size: 2rem;
  }

  .actions-section {
    flex-direction: column;
  }
}
</style>

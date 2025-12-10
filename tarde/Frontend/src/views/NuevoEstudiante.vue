<template>
  <div class="nuevo-estudiante">
    <div class="container">
      <div class="header">
        <h1>➕ Registrar Nuevo Estudiante</h1>
        <router-link to="/estudiantes" class="btn btn-outline">
          ← Volver
        </router-link>
      </div>

      <div class="form-card card">
        <form @submit.prevent="guardar">
          <div class="form-group">
            <label class="form-label">Cédula *</label>
            <input
              v-model="form.cedula"
              type="text"
              class="form-control"
              placeholder="Ingrese la cédula"
              required
              pattern="[0-9]{6,10}"
              title="La cédula debe contener entre 6 y 10 dígitos"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Nombre Completo *</label>
            <input
              v-model="form.nombre"
              type="text"
              class="form-control"
              placeholder="Ingrese el nombre completo"
              required
              minlength="3"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Número de Ficha *</label>
            <input
              v-model="form.numeroFicha"
              type="text"
              class="form-control"
              placeholder="Ingrese el número de ficha"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Email (Opcional)</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Teléfono (Opcional)</label>
            <input
              v-model="form.telefono"
              type="tel"
              class="form-control"
              placeholder="Ingrese el teléfono"
            />
          </div>

          <div v-if="error" class="error-alert">
            ❌ {{ error }}
          </div>

          <div v-if="success" class="success-alert">
            ✅ {{ success }}
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Guardando...' : '💾 Guardar Estudiante' }}
            </button>
            <button type="button" @click="limpiar" class="btn btn-outline">
              🔄 Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEstudiantesStore } from '../stores/estudiantes';

const router = useRouter();
const store = useEstudiantesStore();

const form = ref({
  cedula: '',
  nombre: '',
  numeroFicha: '',
  email: '',
  telefono: ''
});

const loading = ref(false);
const error = ref('');
const success = ref('');

const guardar = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    await store.crearEstudiante(form.value);
    success.value = 'Estudiante registrado exitosamente';
    
    setTimeout(() => {
      router.push('/estudiantes');
    }, 1500);
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar el estudiante';
  } finally {
    loading.value = false;
  }
};

const limpiar = () => {
  form.value = {
    cedula: '',
    nombre: '',
    numeroFicha: '',
    email: '',
    telefono: ''
  };
  error.value = '';
  success.value = '';
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

.form-card {
  max-width: 600px;
  margin: 0 auto;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.error-alert {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
}

.success-alert {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #c3e6cb;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>


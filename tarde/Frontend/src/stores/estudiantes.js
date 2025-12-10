import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useEstudiantesStore = defineStore('estudiantes', {
  state: () => ({
    estudiantes: [],
    estudianteActual: null,
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    total: 0
  }),

  actions: {
    async obtenerEstudiantes(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/estudiantes`, { params });
        this.estudiantes = response.data.data;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.currentPage;
        this.total = response.data.total;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al obtener estudiantes';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async obtenerEstudiantePorId(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/estudiantes/${id}`);
        this.estudianteActual = response.data.data;
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al obtener estudiante';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async crearEstudiante(estudiante) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(`${API_URL}/estudiantes`, estudiante);
        this.estudiantes.unshift(response.data.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear estudiante';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async actualizarEstudiante(id, estudiante) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`${API_URL}/estudiantes/${id}`, estudiante);
        const index = this.estudiantes.findIndex(e => e._id === id);
        if (index !== -1) {
          this.estudiantes[index] = response.data.data;
        }
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar estudiante';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async eliminarEstudiante(id) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`${API_URL}/estudiantes/${id}`);
        this.estudiantes = this.estudiantes.filter(e => e._id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al eliminar estudiante';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async generarQR(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(`${API_URL}/estudiantes/${id}/generar-qr`);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al generar QR';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async buscarPorCedula(cedula) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/estudiantes/cedula/${cedula}`);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al buscar estudiante';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});


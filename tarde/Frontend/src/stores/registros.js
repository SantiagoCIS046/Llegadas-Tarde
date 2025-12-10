import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useRegistrosStore = defineStore('registros', {
  state: () => ({
    registros: [],
    estadisticas: null,
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    total: 0
  }),

  actions: {
    async obtenerRegistros(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/registros`, { params });
        this.registros = response.data.data;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.currentPage;
        this.total = response.data.total;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al obtener registros';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async registrarPorQR(qrCode) {
      this.loading = true;
      this.error = null;
      try {
        const dispositivo = this.obtenerInfoDispositivo();
        const response = await axios.post(`${API_URL}/registros/qr`, {
          qrCode,
          dispositivo
        });
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al registrar por QR';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async registrarPorHuella(cedula, credencialId) {
      this.loading = true;
      this.error = null;
      try {
        const dispositivo = this.obtenerInfoDispositivo();
        const response = await axios.post(`${API_URL}/registros/huella`, {
          cedula,
          credencialId,
          dispositivo
        });
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al registrar por huella';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async registrarPorFaceId(cedula, credencialId) {
      this.loading = true;
      this.error = null;
      try {
        const dispositivo = this.obtenerInfoDispositivo();
        const response = await axios.post(`${API_URL}/registros/faceid`, {
          cedula,
          credencialId,
          dispositivo
        });
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al registrar por Face ID';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async obtenerEstadisticas() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/registros/estadisticas`);
        this.estadisticas = response.data.data;
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al obtener estadísticas';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    obtenerInfoDispositivo() {
      const ua = navigator.userAgent;
      let tipo = 'Web';
      let sistemaOperativo = 'Desconocido';

      if (/iPhone|iPad|iPod/.test(ua)) {
        tipo = 'iOS';
        sistemaOperativo = 'iOS';
      } else if (/Android/.test(ua)) {
        tipo = 'Android';
        sistemaOperativo = 'Android';
      } else if (/Windows/.test(ua)) {
        sistemaOperativo = 'Windows';
      } else if (/Mac/.test(ua)) {
        sistemaOperativo = 'macOS';
      } else if (/Linux/.test(ua)) {
        sistemaOperativo = 'Linux';
      }

      return {
        tipo,
        navegador: this.obtenerNavegador(),
        sistemaOperativo
      };
    },

    obtenerNavegador() {
      const ua = navigator.userAgent;
      if (ua.includes('Firefox')) return 'Firefox';
      if (ua.includes('Chrome')) return 'Chrome';
      if (ua.includes('Safari')) return 'Safari';
      if (ua.includes('Edge')) return 'Edge';
      return 'Desconocido';
    }
  }
});


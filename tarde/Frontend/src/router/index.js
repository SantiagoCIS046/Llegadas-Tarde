import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: { title: "Inicio - LlegadasTarde" },
  },
  {
    path: "/estudiantes",
    name: "Estudiantes",
    component: () => import("../views/Estudiantes.vue"),
    meta: { title: "Estudiantes - LlegadasTarde" },
  },
  {
    path: "/estudiantes/nuevo",
    name: "NuevoEstudiante",
    component: () => import("../views/NuevoEstudiante.vue"),
    meta: { title: "Nuevo Estudiante - LlegadasTarde" },
  },
  {
    path: "/registros",
    name: "Registros",
    component: () => import("../views/Registros.vue"),
    meta: { title: "Registros - LlegadasTarde" },
  },
  {
    path: "/registro-qr",
    name: "RegistroQR",
    component: () => import("../views/RegistroQR.vue"),
    meta: { title: "Registro por QR - LlegadasTarde" },
  },
  {
    path: "/registro-huella",
    name: "RegistroHuella",
    component: () => import("../views/RegistroHuella.vue"),
    meta: { title: "Registro por Huella - LlegadasTarde" },
  },
  {
    path: "/registro-faceid",
    name: "RegistroFaceId",
    component: () => import("../views/RegistroFaceId.vue"),
    meta: { title: "Registro por Face ID - LlegadasTarde" },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: { title: "Dashboard - LlegadasTarde" },
  },
  {
    path: "/configurar-biometria",
    name: "ConfigurarBiometria",
    component: () => import("../views/ConfigurarBiometria.vue"),
    meta: { title: "Configurar Biometría - LlegadasTarde" },
  },
  {
    path: "/mi-qr",
    name: "MiQR",
    component: () => import("../views/MiQR.vue"),
    meta: { title: "Mi Código QR - LlegadasTarde" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Actualizar título de la página
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "LlegadasTarde - SENA";
  next();
});

export default router;

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-icon">🎓</span>
          <span class="brand-text">LlegadasTarde SENA</span>
        </router-link>
      </div>

      <button
        class="navbar-toggle"
        @click="toggleMenu"
        :class="{ active: menuOpen }"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="navbar-menu" :class="{ active: menuOpen }">
        <router-link to="/" class="nav-link" @click="closeMenu">
          <span class="nav-icon">🏠</span>
          Inicio
        </router-link>
        <router-link to="/estudiantes" class="nav-link" @click="closeMenu">
          <span class="nav-icon">👥</span>
          Estudiantes
        </router-link>
        <router-link to="/registros" class="nav-link" @click="closeMenu">
          <span class="nav-icon">📋</span>
          Registros
        </router-link>
        <router-link to="/dashboard" class="nav-link" @click="closeMenu">
          <span class="nav-icon">📊</span>
          Dashboard
        </router-link>
        <router-link
          to="/configurar-biometria"
          class="nav-link"
          @click="closeMenu"
        >
          <span class="nav-icon">🔐</span>
          Biometría
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #39a900 0%, #2d8500 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.navbar-brand .brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

.brand-icon {
  font-size: 2rem;
}

.brand-text {
  font-size: 1.25rem;
}

.navbar-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.navbar-toggle span {
  width: 25px;
  height: 3px;
  background-color: white;
  transition: all 0.3s ease;
  border-radius: 3px;
}

.navbar-menu {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.3);
}

.nav-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .navbar-toggle {
    display: flex;
  }

  .navbar-menu {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #39a900 0%, #2d8500 100%);
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .navbar-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-link {
    width: 100%;
    justify-content: center;
  }
}
</style>

<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
.main-content {
  min-height: calc(100vh - 70px);
  padding: 2rem 0;
}
</style>

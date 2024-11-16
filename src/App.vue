<template>
  <div id="app">
    <nav v-if="showNav">
      <!-- Aquí puedes agregar tu navegación si lo deseas -->
    </nav>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Opcional: Mostrar/ocultar nav según la ruta
const showNav = computed(() => {
  return !['ParticipantRegister', 'AdminLogin'].includes(route.name);
});
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

main {
  padding: 20px;
}
</style>
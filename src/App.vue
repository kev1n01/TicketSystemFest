<template>
  <div id="app" class="flex flex-col">  
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

// Limpia el localStorage al cargar la aplicación
onMounted(() => {
  localStorage.clear();
});
</script>

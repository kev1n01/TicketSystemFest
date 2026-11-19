<template>
  <div>
    <router-view />
    <DemoModeBanner v-if="DemoModeBanner" />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import { isDemoMode } from "./services/data";

// Only loaded when the app runs on demo data (no Firebase credentials).
const DemoModeBanner = isDemoMode
  ? defineAsyncComponent(() => import("./components/DemoModeBanner.vue"))
  : null;

// import { onMounted } from "vue";

// // Limpia el localStorage al cargar la aplicación
// onMounted(() => {
//   localStorage.clear();
// });
</script>

<style scoped>

</style>
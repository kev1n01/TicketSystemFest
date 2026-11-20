<template>
  <div>
    <!-- Fixed "Eclipse Flare" layers; they blend against the body color, so keep them as siblings -->
    <AuraBackground />
    <div class="relative z-[1] min-h-screen">
      <router-view />
      <DemoModeBanner v-if="DemoModeBanner" />
    </div>
    <!-- App-wide notifications (see composables/useToast.js) -->
    <ToastHost />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import AuraBackground from "./components/AuraBackground.vue";
import ToastHost from "./components/ToastHost.vue";
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

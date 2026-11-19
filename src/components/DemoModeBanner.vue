<script setup>
import { ref } from "vue";
import { RotateCcw, X } from "lucide-vue-next";
import { getDemoCredentials, resetDemoData } from "../services/data/localAdapter";

const open = ref(false);
const credentials = getDemoCredentials();

const handleReset = () => {
  resetDemoData();
  window.location.reload();
};
</script>

<template>
  <div class="fixed bottom-4 left-4 z-50 text-sm">
    <button v-if="!open" type="button" @click="open = true"
      class="glass-panel flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-white hover:bg-white/10">
      Modo demo
    </button>

    <div v-else class="glass-panel w-72 rounded-2xl p-4 text-white">
      <div class="mb-2 flex items-center justify-between">
        <p class="flex items-center gap-2 font-bold">
          Modo demo
        </p>
        <button type="button" @click="open = false" aria-label="Cerrar" class="rounded p-0.5 text-white/60 hover:text-white">
          <X class="h-4 w-4" />
        </button>
      </div>

      <p class="mb-3 text-white/70">
        Sin Firebase: se usan datos de ejemplo guardados solo en este navegador.
      </p>

      <dl class="mb-3 space-y-1">
        <div class="flex justify-between">
          <dt class="text-white/70">Código estudiante</dt>
          <dd class="font-mono font-semibold">{{ credentials.studentCode }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-white/70">DNI invitado</dt>
          <dd class="font-mono font-semibold">{{ credentials.guestDni }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-white/70">Usuario admin</dt>
          <dd class="font-mono font-semibold">{{ credentials.admin }}</dd>
        </div>
      </dl>

      <button type="button" @click="handleReset"
        class="btn-secondary w-full py-2">
        <RotateCcw class="h-4 w-4" />
        Restablecer datos demo
      </button>
    </div>
  </div>
</template>

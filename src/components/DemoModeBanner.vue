<script setup>
import { ref } from "vue";
import { FlaskConical, RotateCcw, X } from "lucide-vue-next";
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
      class="flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 font-semibold text-gray-900 shadow-lg hover:bg-amber-300">
      <FlaskConical class="h-4 w-4" />
      Modo demo
    </button>

    <div v-else class="w-72 rounded-lg bg-white p-4 text-gray-800 shadow-2xl">
      <div class="mb-2 flex items-center justify-between">
        <p class="flex items-center gap-2 font-bold">
          <FlaskConical class="h-4 w-4 text-amber-500" />
          Modo demo
        </p>
        <button type="button" @click="open = false" aria-label="Cerrar" class="text-gray-500 hover:text-gray-800">
          <X class="h-4 w-4" />
        </button>
      </div>

      <p class="mb-3 text-gray-600">
        Sin Firebase: se usan datos de ejemplo guardados solo en este navegador.
      </p>

      <dl class="mb-3 space-y-1">
        <div class="flex justify-between">
          <dt>Código estudiante</dt>
          <dd class="font-mono font-semibold">{{ credentials.studentCode }}</dd>
        </div>
        <div class="flex justify-between">
          <dt>DNI invitado</dt>
          <dd class="font-mono font-semibold">{{ credentials.guestDni }}</dd>
        </div>
        <div class="flex justify-between">
          <dt>Usuario admin</dt>
          <dd class="font-mono font-semibold">{{ credentials.admin }}</dd>
        </div>
      </dl>

      <button type="button" @click="handleReset"
        class="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 py-2 font-semibold hover:bg-gray-100">
        <RotateCcw class="h-4 w-4" />
        Restablecer datos demo
      </button>
    </div>
  </div>
</template>

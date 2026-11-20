<template>
  <main class="flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6">
    <div class="w-full max-w-md">
      <!-- Event mark on a white tile so it stays legible over the aura -->
      <div class="mb-6 flex justify-center">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 sm:h-16 sm:w-16">
          <img src="/icon.png" alt="Logo de System Fest" class="max-h-full w-auto object-contain">
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="glass-panel p-6 sm:p-8">
        <TicketTypeTabs />
        <h1 class="text-2xl font-bold leading-tight">Genera tu ticket de estudiante</h1>
        <p class="mt-2 text-white/70">
          Con tu código universitario obtienes el QR que mostrarás en la entrada.
        </p>

        <div class="mt-6 space-y-5">
          <div>
            <label for="cod" class="field-label">Código universitario</label>
            <input v-model="formData.cod" type="text" id="cod" placeholder="Ingresa tu código" class="field-input"
              required max="10" min="10" maxlength="10" :readonly="loading" />
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full">
            {{ loading ? "Buscando…" : "Generar ticket" }}
          </button>
        </div>

        <SearchSteps :steps="steps" :visible="visible" />
      </form>

      <div class="mt-4 flex justify-center">
        <router-link to="/home"
          class="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3 text-sm font-medium text-white/70 transition-colors hover:text-white">
          <ArrowLeft class="h-4 w-4" aria-hidden="true" />
          Volver al inicio
        </router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { ArrowLeft } from "lucide-vue-next";
import TicketTypeTabs from "../components/TicketTypeTabs.vue";
import SearchSteps from "../components/SearchSteps.vue";
import { useSearchSteps } from "../composables/useSearchSteps";
import { toast } from "../composables/useToast";

const router = useRouter();
const userStore = useUserStore();

const formData = ref({
  cod: "",
});

const loading = ref(false);
const { steps, visible, run, reset } = useSearchSteps([
  "Buscando tu código",
  "Revisando tu registro",
  "Generando tu ticket",
]);

// Editing the code after a failed search clears the old progress
watch(() => formData.value.cod, () => {
  if (!loading.value) reset();
});

const handleSubmit = async () => {
  if (loading.value) return;

  if (!formData.value.cod) {
    toast.error("Todos los campos son obligatorios.");
    return;
  }

  loading.value = true;
  try {
    const result = await run(() => userStore.updateParticipantStatus(formData.value.cod));

    if (result.success) {
      toast.success(result.message, { title: "Ticket listo", exclusive: true });
      // Short beat on the completed steps; the toast stays visible on the ticket page.
      // The form stays locked until then.
      setTimeout(() => router.push("/view-ticket"), 500);
      return;
    }

    toast.error(result.message, { title: "No se pudo generar el ticket" });
  } catch (error) {
    toast.error("Ocurrió un error al generar el ticket, inténtelo más tarde.");
  }
  loading.value = false;
};
</script>

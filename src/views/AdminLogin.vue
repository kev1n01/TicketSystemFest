<template>
  <main class="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6">
    <form @submit.prevent="handleLogin" class="glass-panel w-full max-w-sm p-6 sm:max-w-md sm:p-8">
      <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Iniciar sesión</h1>
      <p class="mt-1.5 text-sm text-white/65 sm:text-base">
        Ingresa tu usuario de staff para escanear tickets y gestionar el sorteo.
      </p>

      <div class="mt-6 space-y-3 empty:hidden" aria-live="polite">
        <p v-if="messageValidateError !== ''" class="alert-error">
          {{ messageValidateError }}
        </p>
        <p v-if="messageValidateSuccess !== ''" class="alert-success">
          {{ messageValidateSuccess }}
        </p>
      </div>

      <!-- Usuario -->
      <div class="mt-6">
        <label for="username" class="field-label">Nombre de usuario</label>
        <input v-model="username" type="text" id="username" placeholder="Ingresa tu usuario" class="field-input"
          autocomplete="username" autocapitalize="none" spellcheck="false" required autofocus />
      </div>

      <!-- Botón -->
      <button type="submit" :disabled="loading"
        class="btn-primary mt-6 min-h-12 w-full bg-lilac text-night hover:bg-lilac/90">
        <LoaderCircle v-if="loading" class="h-5 w-5 animate-spin" aria-hidden="true" />
        <span>{{ loading ? "Validando…" : "Ingresar" }}</span>
      </button>
    </form>

    <router-link to="/home"
      class="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-white/65 transition-colors hover:text-white">
      <ArrowLeft class="h-4 w-4" aria-hidden="true" />
      Volver al inicio
    </router-link>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { LoaderCircle, ArrowLeft } from "lucide-vue-next";
import speaker from "../speaker";

const router = useRouter();
const userStore = useUserStore();
const messageValidateError = ref("");
const messageValidateSuccess = ref("");
const username = ref("");
const loading = ref(false);

const handleLogin = async () => {
  try {
    loading.value = true;
    messageValidateError.value = "";
    messageValidateSuccess.value = "";

    if (!username.value) {
      messageValidateError.value = "El campo de nombre de usuario es obligatorio.";
      return;
    }

    const result = await userStore.validateAdmin(username.value);

    if (!result.success) {
      messageValidateError.value = result.message;
      return;
    }

    if (result.success) {
      messageValidateSuccess.value = result.message;
      speaker(result.message);
      setTimeout(() => {
        router.push("/scanner");
      }, 2000);
      
    }
  } catch (err) {
    messageValidateError.value = "Error al iniciar sesión";
  } finally {
    loading.value = false;
  }
};
</script>

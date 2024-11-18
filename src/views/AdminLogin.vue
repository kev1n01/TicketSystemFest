<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-black/80 via-black/90 to-blue-900 text-white px-4 sm:px-6 lg:px-8 font-epilogue">
    <form @submit.prevent="handleLogin" class="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md">
      <h2 class="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
        Iniciar Sesión
      </h2>

      <div>
        <p v-if="messageValidateError !== ''"
          class="text-red-600 text-sm md:text-base mb-4 font-semibold text-center p-2 bg-red-300/40 border border-red-400 rounded-md">
          {{ messageValidateError }}
        </p>
        <p v-if="messageValidateSuccess !== ''"
          class="text-green-600 text-sm md:text-base mb-4 font-semibold text-center p-2 bg-green-300/40 border border-green-400 rounded-md">
          {{ messageValidateSuccess }}
        </p>
      </div>

      <!-- Usuario -->
      <div class="mb-6">
        <label for="username" class="block text-sm sm:text-base font-medium text-gray-700 mb-1">
          Nombre de usuario
        </label>
        <input v-model="username" type="text" id="username" placeholder="Ingresa tu usuario"
          class="w-full p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          spellcheck="false" required autofocus />
      </div>

      <!-- Botón -->
      <button type="submit" :disabled="loading"
        class="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200 flex items-center justify-center">
        <LoaderCircle v-if="loading" class="animate-spin mr-2" />
        <span>{{ loading ? "Validando..." : "Ingresar" }}</span>
      </button>

      <!-- Mostrar mensaje de error -->
      <div v-if="error" class="mt-4 text-sm text-center text-red-500">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { LoaderCircle } from "lucide-vue-next";
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
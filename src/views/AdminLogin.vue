<template>
    <div
      class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white px-4 sm:px-6 lg:px-8"
    >
      <form
        @submit.prevent="handleLogin"
        class="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md"
      >
        <h2 class="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>
  
        <!-- Usuario -->
        <div class="mb-6">
          <label
            for="username"
            class="block text-sm sm:text-base font-medium text-gray-700 mb-1"
          >
            Usuario
          </label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Ingresa tu usuario"
            class="w-full p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            spellcheck="false"
          />
        </div>
  
        <!-- Botón -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200 flex items-center justify-center"
        >
          <span
            v-if="loading"
            class="animate-spin mr-2 border-2 border-t-2 border-white border-opacity-50 rounded-full w-4 h-4 sm:w-5 sm:h-5"
          ></span>
          <span>{{ loading ? "Entrando..." : "Entrar" }}</span>
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
  
  const router = useRouter();
  const userStore = useUserStore();
  
  const username = ref("");
  const error = ref(false);
  const errorMessage = ref("");
  const loading = ref(false);
  
  const handleLogin = async () => {
    try {
      loading.value = true;
      error.value = false;
  
      const isValidAdmin = await userStore.validateAdmin(username.value);
  
      if (!isValidAdmin) {
        error.value = true;
        errorMessage.value = "Credenciales inválidas";
        return;
      }
  
      localStorage.setItem(
        "adminSession",
        JSON.stringify({
          username: username.value,
          timestamp: new Date().getTime(),
        })
      );
  
      router.push("/scanner");
    } catch (err) {
      error.value = true;
      errorMessage.value = "Error al iniciar sesión";
      console.error("Login error:", err);
    } finally {
      loading.value = false;
    }
  };
  </script>
  
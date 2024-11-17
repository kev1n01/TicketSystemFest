<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white px-4 sm:px-6 lg:px-8"
  >
    <div
      class="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-sm sm:max-w-lg"
    >
      <!-- Título -->
      <h2 class="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
        Datos del Participante
      </h2>

      <!-- Información del Participante -->
      <div class="mb-6">
        <div class="mb-4">
          <label class="block text-sm sm:text-base font-medium text-gray-700">
            DNI:
          </label>
          <p class="text-gray-900">{{ userData.dni }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-sm sm:text-base font-medium text-gray-700">
            Código:
          </label>
          <p class="text-gray-900">{{ userData.code }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-sm sm:text-base font-medium text-gray-700">
            Nombres Completos:
          </label>
          <p class="text-gray-900">{{ userData.fullName }}</p>
        </div>
      </div>

      <!-- Código QR -->
      <div class="text-center mb-6">
        <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-3">
          Tu Código QR
        </h3>
        <img
          :src="qrCode"
          alt="QR Code"
          class="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-2"
        />
        <p class="text-xs sm:text-sm text-gray-600">
          Este código QR será escaneado para verificar tu asistencia
        </p>
      </div>

      <!-- Botón de Cerrar Sesión -->
      <div class="text-center">
        <button
          @click="handleLogout"
          class="w-full bg-red-600 text-white py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition duration-200"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userData = ref({});
const qrCode = ref("");

onMounted(() => {
  const storedUserData = localStorage.getItem("userInfo");
  const storedQR = localStorage.getItem("userQR");

  if (!storedUserData || !storedQR) {
    router.push("/register");
    return;
  }

  // Cargar datos desde localStorage
  userData.value = JSON.parse(storedUserData);
  qrCode.value = storedQR;
});

const handleLogout = () => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("userQR");
  router.push("/register");
};
</script>

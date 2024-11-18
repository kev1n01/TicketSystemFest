<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-black/80 via-black/90 to-red-900 text-white px-4 sm:px-6 lg:px-8 font-epilogue">
    <div class="grid grid-cols-3 gap-4 mb-4">
      <div class="bg-white p-3 rounded-lg shadow-xl min-h-32">
        <img src="../assets/imgs/ltd.png" alt="" class="w-28">
      </div>
      <div class="bg-white p-3 rounded-lg shadow-xl min-h-32">
        <img src="../assets/imgs/paisi.png" alt="" class="w-28">
      </div>
      <div class="bg-white p-3 rounded-lg shadow-xl min-h-32">
        <img src="/public/icon.png" alt="" class="w-28">
      </div>
    </div>

    <!-- <div class="mb-4">
      <div class="bg-white px-5 py-2 rounded-lg shadow-xl max-w-sm min-w-sm sm:max-w-md min-h-24 h-28">
        <img src="../assets/imgs/paisi_logo.png" alt="" class="w-[408px]">
      </div>
    </div> -->
    <form @submit.prevent="handleSubmit"
      class="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md shadow-red-500/20">
      <h2 class="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
        Generar ticket
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

      <!-- DNI -->
      <div class="mb-4">
        <label for="dni" class="block text-sm sm:text-base font-medium text-gray-700 mb-1">
          DNI
        </label>
        <input v-model="formData.dni" type="text" id="dni" autofocus placeholder="Ingresa tu DNI"
          class="w-full p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900"
          required max="8" min="8" maxlength="8" />
      </div>

      <!-- Código -->
      <div class="mb-4">
        <label for="cod" class="block text-sm sm:text-base font-medium text-gray-700 mb-1">
          Código (COD)
        </label>
        <input v-model="formData.cod" type="text" id="cod" placeholder="Ingresa tu Código"
          class="w-full p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900"
          required max="10" min="10" maxlength="10" />
      </div>

      <!-- Botón -->
      <button type="submit" :disabled="loading"
        class="w-full bg-red-600 text-white py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition duration-200 flex items-center justify-center">
        <!-- Icono de carga -->
        <LoaderCircle v-if="loading" class="animate-spin mr-2" />
        <span>{{ loading ? "Generando..." : "Generar" }}</span>

      </button>
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

const formData = ref({
  dni: "",
  cod: "",
});

const loading = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;
    messageValidateError.value = "";
    messageValidateSuccess.value = "";

    if (!formData.value.dni || !formData.value.cod) {
      messageValidateError.value = "Todos los campos son obligatorios.";
      return;
    }

    // actualizando estado del participante
    const result = await userStore.updateParticipantStatus(formData.value.dni, formData.value.cod);

    if (!result.success) {
      messageValidateError.value = result.message;
      return;
    }

    if (result.success) {
      messageValidateSuccess.value = result.message;
      speaker(result.message);

      setTimeout(() => {
        router.push("/participant-details");
      }, 2000);
    }
  } catch (error) {
    messageValidateError.value = "Ocurrió un error al generar el ticket, intentelo más tarde.";
  } finally {
    loading.value = false;
  }
};

</script>

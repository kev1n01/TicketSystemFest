<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white px-4 sm:px-6 lg:px-8"
  >
    <form
      @submit.prevent="handleSubmit"
      class="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md"
    >
      <h2 class="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
        Registro de Participantes
      </h2>

      <!-- DNI -->
      <div class="mb-4">
        <label
          for="dni"
          class="block text-sm sm:text-base font-medium text-gray-700 mb-1"
        >
          DNI
        </label>
        <input
          v-model="formData.dni"
          type="text"
          id="dni"
          placeholder="Ingresa tu DNI"
          class="w-full p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          required
        />
      </div>

      <!-- Código -->
      <div class="mb-4">
        <label
          for="cod"
          class="block text-sm sm:text-base font-medium text-gray-700 mb-1"
        >
          Código (COD)
        </label>
        <input
          v-model="formData.cod"
          type="text"
          id="cod"
          placeholder="Ingresa tu Código"
          class="w-full p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          required
        />
      </div>

      <!-- Botón -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-200 flex items-center justify-center"
      >
        <!-- Icono de carga -->
        <span
          v-if="loading"
          class="animate-spin mr-2 border-2 border-t-2 border-white border-opacity-50 rounded-full w-4 h-4 sm:w-5 sm:h-5"
        ></span>
        <span>{{ loading ? "Validando..." : "Registrar" }}</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import QRCode from "qrcode";

const router = useRouter();
const userStore = useUserStore();

const formData = ref({
  dni: "",
  cod: "",
});

const loading = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;

    if (!formData.value.dni || !formData.value.cod) {
      alert("Por favor, completa los campos de DNI y Código.");
      loading.value = false;
      return;
    }

    const participant = await userStore.validateDNI(formData.value.dni);
    if (!participant || participant.COD !== formData.value.cod) {
      alert("DNI no encontrado o el Código no coincide con los datos en la base de datos.");
      loading.value = false;
      return;
    }

    // Concatenar nombres completos
    const fullName = `${participant.PATERNO} ${participant.MATERNO} ${participant.NOMBRES}`;

    const success = await userStore.updateParticipantStatus(formData.value.dni);
    if (success) {
      const qrCode = await QRCode.toDataURL(formData.value.dni);
      localStorage.setItem("userQR", qrCode);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ dni: formData.value.dni, code: participant.COD, fullName })
      );
      router.push("/participant-details");
    }
  } catch (error) {
    console.error("Error en registro:", error);
    alert("Ocurrió un error durante el registro.");
  } finally {
    loading.value = false;
  }
};

</script>

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
        <div class="mb-6">
          <label
            for="code"
            class="block text-sm sm:text-base font-medium text-gray-700 mb-1"
          >
            Código
          </label>
          <input
            v-model="formData.code"
            type="text"
            id="code"
            placeholder="Ingresa el código"
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
    code: "",
  });
  
  const loading = ref(false);
  
  const handleSubmit = async () => {
    try {
      loading.value = true;
  
      // Validar que todos los campos estén completos
      if (!formData.value.dni || !formData.value.code) {
        alert("Por favor, completa todos los campos.");
        loading.value = false;
        return;
      }
  
      // Validar que el DNI exista
      const participant = await userStore.validateDNI(formData.value.dni);
      if (!participant) {
        alert("DNI no encontrado en la base de datos.");
        loading.value = false;
        return;
      }
  
      // Validar que el Código coincida
      if (participant.COD !== formData.value.code) {
        alert("El código no coincide con el DNI ingresado.");
        loading.value = false;
        return;
      }
  
      // Actualizar el estado del participante
      const success = await userStore.updateParticipantStatus(formData.value.dni);
      if (success) {
        console.log("Participante registrado exitosamente");
        // Generar QR
        const qrCode = await QRCode.toDataURL(formData.value.dni);
        localStorage.setItem("userQR", qrCode);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ dni: formData.value.dni, code: formData.value.code })
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
  
<template>
  <DashLayout>

    <div class="bg-white relative p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-sm sm:max-w-lg mt-16 xs:mt-40 sm:mt-40 md:mt-40 xl:mt-32 2xl:mt-16 my-20" id="ticket">
      <!-- Fecha y Hora -->
      <div
        class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-400 text-white py-3 px-5 rounded-md shadow  flex justify-between gap-8 w-3/4 md:w-3/5">
        <p class="text-xs sm:text-sm font-semibold">29 de Noviembre </p>
        <p class="text-xs sm:text-sm font-semibold">01:00 PM</p>
      </div>

      <!-- Título -->
      <h2 class="mt-5 text-4xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl font-bold text-center text-gray-800 mb-6 font-russo
          bg-gradient-to-r from-red-600 via-black/80 to-red-600 bg-clip-text text-transparent">
        System Fest 2024
      </h2>

      <!-- Información del Participante -->
      <div class="mb-6 text-center">
        <div class="mb-4">
          <p class="text-gray-900 font-semibold text-lg sm:text-xl md:text-lg">{{ userData.fullName }}</p>
        </div>
        <div class="mb-4">
          <span class="text-gray-800 text-sm sm:text-base">DNI: {{ userData.dni }}</span>
        </div>
        <div class="mb-4">
          <p class="text-gray-800 text-sm sm:text-base">Código: {{ userData.code }}</p>
        </div>
      </div>

      <!-- Tipo de ticket -->
      <div class="mb-6 md:mb-0 flex justify-center">
        <div
          class="text-white font-semibold text-center py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full text-sm sm:text-base md:text-sm shadow-lg">
          Ticket Estudiante
        </div>
      </div>

      <!-- Código QR -->
      <div class="text-center mb-6 md:mb-2 mx-auto mt-10 sm:mt-5 md:mt-0">
        <img :src="userData.qrCode" alt="QR Code" class="w-36 h-3w-36 sm:w-48 sm:h-48 mx-auto mb-2 rounded-lg" />
        <p class="text-sm sm:text-base text-gray-700 font-medium ">
          Este código QR será escaneado para verificar tu asistencia
        </p>
      </div>

      <!-- Mensaje al final -->
      <div class="mt-4 text-center md:mt-0">
        <p class="text-sm text-gray-600">Gracias por participar en el System Fest 2024</p>
      </div>
    </div>

  </DashLayout>

</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from '../stores/userStore';
import DashLayout from "../layout/DashLayout.vue";

const userStore = useUserStore();
const router = useRouter();
const userData = ref({ dni: "", code: "", fullName: "", qrCode: "" });

onMounted(() => {
  if (!userStore.userHashCode || !userStore.userQr) {
    router.push("/generate-ticket");
    return;
  }

  // Cargar datos desde localStorage
  userData.value.dni = userStore.userDni;
  userData.value.code = userStore.userCode;
  userData.value.fullName = userStore.userFullName;
  userData.value.qrCode = userStore.userQr;
});


</script>

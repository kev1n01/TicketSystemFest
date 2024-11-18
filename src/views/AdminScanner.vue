<template>
  <DashLayout class="bg-gradient-to-t !from-black/80 !via-black/90 !to-blue-900">
    <div
      class="bg-white relative p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-sm sm:max-w-lg mt-16 xs:mt-28 sm:mt-28 md:mt-28 xl:mt-32 2xl:mt-16 my-20">
      <div class="bg-white px-4 py-2 sm:p-8 rounded-lg  w-full max-w-sm sm:max-w-lg">
        <!-- Título -->
        <h2 class="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
          Escáner QR
        </h2>

        <!-- Escáner -->
        <div id="reader" class="mx-auto mb-6" style="width: 100%; aspect-ratio: 2 / 1;"></div>

        <!-- Skeleton Loader -->
        <div v-if="loading" class="animate-pulse">
          <div class="h-8 bg-gray-300/20 rounded mb-4 border-[1px] border-dotted border-black/80 "></div>
          <div class="h-6 bg-gray-300 rounded mb-4"></div>
          <div class="flex justify-between gap-2">
            <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>

        <!-- Información del Participante -->
        <div v-else v-if="participantData" class="mb-6 animate-fade-in">
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

          <!-- Información del participante -->
          <div class="mb-4">
            <p class="text-gray-900 font-medium text-center text-lg">
              {{ participantData.NOMBRES }} {{ participantData.PATERNO }} {{ participantData.MATERNO }}
            </p>
          </div>
          <div class="flex justify-between">
            <div>
              <p class="text-gray-900 text-base">DNI: {{ participantData.DNI }}</p>
            </div>
            <div>
              <p class="text-gray-900 text-base">Código: {{ participantData.COD }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashLayout>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Html5Qrcode } from "html5-qrcode";
import { useUserStore } from "../stores/userStore";
import DashLayout from "../layout/DashLayout.vue";

const userStore = useUserStore();
const participantData = ref(null);
const messageValidateError = ref(""); // Para manejar mensajes de error
const messageValidateSuccess = ref(""); // Para manejar mensajes de éxito
const loading = ref(false); // Estado para el skeleton loader

let html5QrCode = null;

// Manejo del escaneo QR
const onDecode = async (decodedString) => {
  try {
    messageValidateError.value = "";
    messageValidateSuccess.value = "";
    loading.value = true; // Mostrar el loader

    const result = await userStore.updateParticipantStatusToAdmin(decodedString);

    if (!result.success) {
      if (result.data) {
        participantData.value = result.data;
      }
      messageValidateError.value = result.message;
      loading.value = false; // Ocultar el loader
      return;
    }

    if (result.success) {
      participantData.value = result.data;
      messageValidateSuccess.value = result.message;
    }
  } catch (error) {
    messageValidateError.value = "Ocurrió un error durante el escaneo. Intenta nuevamente.";
  } finally {
    loading.value = false; // Ocultar el loader siempre
  }
};

// Iniciar el escáner
const startScanner = () => {
  html5QrCode = new Html5Qrcode("reader");

  html5QrCode
    .start(
      { facingMode: "environment" },
      {
        fps: 10, // Frames por segundo
        qrbox: 250, // Área del escaneo
      },
      (decodedText) => {
        onDecode(decodedText);
      },
      (errorMessage) => {
        console.warn("Escaneo fallido:", errorMessage);
      }
    )
    .catch((err) => {
      console.error("Error al iniciar el escáner:", err);
    });
};

// Detener el escáner al desmontar el componente
onMounted(() => {
  startScanner();
});

onUnmounted(() => {
  if (html5QrCode) {
    html5QrCode.stop().catch((err) =>
      console.error("Error al detener el escáner:", err)
    );
  }
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
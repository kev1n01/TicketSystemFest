<template>
  <DashLayout class="bg-gradient-to-t !from-black/80 !via-black/90 !to-blue-900">
    <div
      class="bg-white relative p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-sm sm:max-w-lg mt-16 xs:mt-28 sm:mt-28 md:mt-28 xl:mt-32 2xl:mt-16 my-20">
      <div class="bg-white px-4 py-2 sm:p-8 rounded-lg  w-full max-w-sm sm:max-w-lg">
        <!-- Título -->
        <h2 class="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
          Escáner QR
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

        <div class="scanner-container">
          <!-- Escáner -->
          <div id="reader" class="scanner mx-auto" style="width: 100%; aspect-ratio: 2 / 1;"></div>
          <!-- Barra de animación -->
          <div class="scanner-bar"></div>
        </div>

        <!-- Skeleton Loader -->
        <div v-if="loading" class="animate-pulse">
          <div class="flex justify-center items-center content-center gap-2 mt-3 flex-col space-y-2">
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            <div class="h-4 bg-gray-300 rounded w-1/2"></div>
            <div class="h-6 bg-gray-300 rounded-full w-2/4"></div>
          </div>
        </div>

        <!-- Información del Participante -->
        <div v-else v-if="participantData" class="mb-0 animate-fade-in mt-5">
          <!-- Información del participante -->
          <div class="mb-4">
            <p class="text-gray-900 font-medium text-center text-lg">
              {{ participantData.nombres }}
            </p>
          </div>
          <div class="flex justify-center flex-col gap-2 items-center content-center">
            <div v-if="participantData.dni">
              <p class="text-gray-900 text-base">DNI: {{ participantData.dni }}</p>
            </div>
            <div v-if="participantData.cod">
              <p class="text-gray-900 text-base">Código: {{ participantData.cod }}</p>
            </div>
            <div
              class="text-white font-semibold text-center py-2 px-4 bg-gradient-to-r rounded-full text-sm sm:text-base md:text-sm shadow-lg"
              :class="typeParticipant === 'invitado'
                  ? 'from-green-500 to-green-600' : 'from-blue-500 to-blue-600'">
              Ticket {{ typeParticipant }}
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
import speaker from "../speaker";

const userStore = useUserStore();
const participantData = ref(null);
const messageValidateError = ref(""); // Para manejar mensajes de error
const messageValidateSuccess = ref(""); // Para manejar mensajes de éxito
const typeParticipant = ref(""); // Para conocer el tipo de participante
const loading = ref(false); // Estado para el skeleton loader
const isScanning = ref(false); // Estado para controlar si ya se está procesando un código

let html5QrCode = null;

// Manejo del escaneo QR
const onDecode = async (decodedString) => {
  if (isScanning.value) return; // Evitar múltiples escaneos

  isScanning.value = true; // Bloquear nuevos escaneos mientras se procesa
  try {
    messageValidateError.value = "";
    messageValidateSuccess.value = "";
    typeParticipant.value = "";
    participantData.value = null;
    loading.value = true; // Mostrar el loader
    const result = await userStore.updateParticipantStatusToAdmin(decodedString);

    if (!result.success) {
      if (result.data) {
        typeParticipant.value = result.type;
        participantData.value = result.data;
      }
      messageValidateError.value = result.message;
      // speaker(result.message);
      return;
    }

    if (result.success) {
      participantData.value = result.data;
      messageValidateSuccess.value = result.message;
      typeParticipant.value = result.type;
      // speaker(result.message);
    }
  } catch (error) {
    messageValidateError.value = "Ocurrió un error durante el escaneo. Intenta nuevamente.";
  } finally {
    loading.value = false; // Ocultar el loader siempre
    isScanning.value = false; // Desbloquear escaneo
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
        qrbox: { width: 250, height: 350 }, // Área del escaneo
      },
      (decodedText) => {
        onDecode(decodedText);
      },
      (errorMessage) => {
        // console.warn("Escaneo fallido:", errorMessage);
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

.scanner-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  /* Ajusta el ancho máximo según tus necesidades */
  height: 300px;
  /* Alto fijo */
  background: black;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

/* Escáner */
.scanner {
  position: absolute;
  width: 100%;
  height: 300px !important;
  background: rgba(0, 0, 0, 0.1);
  padding-top: 0px;
}

/* Barra animada */
.scanner-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  opacity: 0.5;
  /* Altura de la barra */
  background: linear-gradient(to bottom, #0088ff, #0088ff);
  animation: scan-bar 5s infinite;
  box-shadow: 0 0 10px 2px rgba(0, 0, 255, 0.5);
  z-index: 1;
}

/* Animación de la barra */
@keyframes scan-bar {
  0% {
    top: 0;
  }

  50% {
    top: 90%;
    /* Baja al 90% del contenedor */
  }

  100% {
    top: 0;
    /* Regresa al inicio */
  }
}
</style>
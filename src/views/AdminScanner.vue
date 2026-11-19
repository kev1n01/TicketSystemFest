<template>
  <DashLayout>
    <section class="glass-panel w-full max-w-lg p-5 sm:p-8">
      <header class="mb-5">
        <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Escanear ticket</h1>
        <p class="mt-1.5 text-sm text-white/65 sm:text-base">
          Centra el código QR del ticket dentro del recuadro.
        </p>
      </header>

      <div class="scanner-container">
        <!-- Escáner -->
        <div id="reader" class="scanner"></div>
        <!-- Barra de animación -->
        <div class="scanner-bar" aria-hidden="true"></div>
        <!-- Esquinas del recuadro -->
        <span class="pointer-events-none absolute left-3 top-3 z-[2] h-8 w-8 rounded-tl-xl border-l-[3px] border-t-[3px] border-lilac"
          aria-hidden="true"></span>
        <span class="pointer-events-none absolute right-3 top-3 z-[2] h-8 w-8 rounded-tr-xl border-r-[3px] border-t-[3px] border-lilac"
          aria-hidden="true"></span>
        <span class="pointer-events-none absolute bottom-3 left-3 z-[2] h-8 w-8 rounded-bl-xl border-b-[3px] border-l-[3px] border-lilac"
          aria-hidden="true"></span>
        <span class="pointer-events-none absolute bottom-3 right-3 z-[2] h-8 w-8 rounded-br-xl border-b-[3px] border-r-[3px] border-lilac"
          aria-hidden="true"></span>
      </div>

      <!-- Resultado del escaneo: debajo de la cámara para que el recuadro no se mueva -->
      <div class="mt-5 space-y-3 empty:hidden" aria-live="polite">
        <p v-if="messageValidateError !== ''" class="alert-error text-base">
          {{ messageValidateError }}
        </p>
        <p v-if="messageValidateSuccess !== ''" class="alert-success text-base">
          {{ messageValidateSuccess }}
        </p>

        <!-- Skeleton Loader -->
        <div v-if="loading" class="animate-pulse rounded-2xl border border-white/10 p-4 sm:p-5" aria-hidden="true">
          <div class="h-6 w-2/3 rounded-md bg-white/10"></div>
          <div class="mt-3 h-4 w-1/3 rounded-md bg-white/10"></div>
          <div class="mt-4 h-8 w-36 rounded-full bg-white/10"></div>
        </div>

        <!-- Información del Participante -->
        <article v-else-if="participantData" class="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="break-words text-xl font-semibold leading-snug">
                {{ participantData.nombres }}
              </p>
              <p v-if="participantData.dni" class="mt-1 tabular-nums text-white/70">
                DNI: {{ participantData.dni }}
              </p>
              <p v-if="participantData.cod" class="mt-1 tabular-nums text-white/70">
                Código: {{ participantData.cod }}
              </p>
            </div>
            <span class="inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-sm font-semibold ring-1"
              :class="typeParticipant === 'invitado'
                ? 'bg-flare/15 text-flare ring-flare/35'
                : 'bg-sky-400/15 text-sky-200 ring-sky-300/35'">
              Ticket {{ typeParticipant }}
            </span>
          </div>
        </article>
      </div>
    </section>
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
      return;
    }

    if (result.success) {
      participantData.value = result.data;
      messageValidateSuccess.value = result.message;
      typeParticipant.value = result.type;
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
        // Área de escaneo cuadrada: 70% del lado menor de la cámara, sea vertical (móvil) u horizontal
        qrbox: (width, height) => {
          const size = Math.max(160, Math.floor(Math.min(width, height) * 0.7));
          return { width: size, height: size };
        },
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
/* The height follows the camera stream, so portrait phone cameras are shown in full */
.scanner-container {
  position: relative;
  width: 100%;
  min-height: 16rem;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.25rem;
  overflow: hidden;
}

/* Escáner */
.scanner {
  position: relative;
  width: 100%;
  border: 0 !important;
}

/* html5-qrcode injects the <video> at runtime, so it needs :deep() to be styled */
.scanner :deep(video) {
  display: block;
  width: 100% !important;
  height: auto !important;
  max-height: 75vh;
  object-fit: contain;
}

/* Barra animada */
.scanner-bar {
  position: absolute;
  top: 4%;
  left: 8%;
  width: 84%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8e7be3 20%, #f868c4 50%, #8e7be3 80%, transparent);
  box-shadow: 0 0 12px 2px rgba(142, 123, 227, 0.55);
  opacity: 0.85;
  animation: scan-bar 5s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

/* Animación de la barra */
@keyframes scan-bar {
  0%,
  100% {
    top: 4%;
  }

  50% {
    /* Baja casi hasta el borde inferior del contenedor */
    top: 94%;
  }
}
</style>

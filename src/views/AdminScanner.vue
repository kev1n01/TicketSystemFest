<template>
    <div
      class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white px-4 sm:px-6 lg:px-8"
    >
      <div class="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-sm sm:max-w-lg">
        <!-- Título -->
        <h2 class="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
          Escáner QR
        </h2>
  
        <!-- Escáner -->
        <div
          id="reader"
          class="mx-auto mb-6"
          style="width: 100%; max-width: 300px; aspect-ratio: 1;"
        ></div>
  
        <!-- Información del Participante -->
        <div v-if="participantData" class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">
            Datos del Participante
          </h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">DNI:</label>
            <p class="text-gray-900">{{ participantData.DNI }}</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Código:</label>
            <p class="text-gray-900">{{ participantData.COD }}</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Nombre:</label>
            <p class="text-gray-900">
              {{ participantData.NOMBRES }} {{ participantData.PATERNO }}
            </p>
          </div>
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
  import { ref, onMounted, onUnmounted } from "vue";
  import { Html5Qrcode } from "html5-qrcode";
  import { useUserStore } from "../stores/userStore";
  import { useRouter } from "vue-router";
  
  const userStore = useUserStore();
  const router = useRouter();
  const participantData = ref(null);
  let html5QrCode = null;
  
  // Manejo del escaneo QR
  const onDecode = async (decodedString) => {
    try {
      const result = await userStore.updateParticipantStatusToAdmin(decodedString);
      if (result.success) {
        participantData.value = result.data;
        console.log("Participante actualizado:", participantData.value);
        alert("Participante actualizado exitosamente");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(error.message);
      console.error("Error scanning QR:", error);
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
  
  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    router.push("/admin");
  };
  </script>
  
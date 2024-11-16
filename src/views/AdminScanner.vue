<template>
    <div>
        <div id="reader" style="width: 300px;"></div>
        <div v-if="participantData" class="participant-info">
            <h3>Datos del Participante</h3>
            <p>DNI: {{ participantData.DNI }}</p>
            <p>Código: {{ participantData.COD }}</p>
            <p>Nombre: {{ participantData.NOMBRES }} {{ participantData.PATERNO }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const participantData = ref(null);
let html5QrCode = null;

const onDecode = async (decodedString) => {
    try {
        const result = await userStore.updateParticipantStatusToAdmin(decodedString);
        if (result.success) {
            participantData.value = result.data;
            console.log('Participante actualizado:', participantData.value);
            alert('Participante actualizado exitosamente');
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert(error.message);
        console.error('Error scanning QR:', error);
    }
};

const startScanner = () => {
    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
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
    ).catch((err) => {
        console.error("Error al iniciar el escáner:", err);
    });
};

onMounted(() => {
    startScanner();
});

onUnmounted(() => {
    if (html5QrCode) {
        html5QrCode.stop().catch((err) => console.error("Error al detener el escáner:", err));
    }
});
</script>
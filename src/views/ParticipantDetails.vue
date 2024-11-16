<template>
    <div class="container">
        <div class="participant-info">
            <h2 class="text-center mb-3">Datos del Participante</h2>

            <div class="card">
                <div class="form-group">
                    <label>DNI:</label>
                    <p>{{ userData.dni }}</p>
                </div>
                <div class="form-group">
                    <label>Código:</label>
                    <p>{{ userData.code }}</p>
                </div>
                <div class="form-group">
                    <label>Nombres Completos:</label>
                    <p>{{ userData.fullName }}</p>
                </div>
            </div>

            <div class="qr-code-container">
                <h3 class="mb-2">Tu Código QR</h3>
                <img :src="qrCode" alt="QR Code" class="mb-2">
                <p class="text-center text-sm text-gray-600">
                    Este código QR será escaneado para verificar tu asistencia
                </p>
            </div>

            <div class="mt-4 text-center">
                <button @click="handleLogout" class="btn btn-danger">
                    Cerrar Sesión
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userData = ref({});
const qrCode = ref('');

onMounted(() => {
    const storedUserData = localStorage.getItem('userInfo');
    const storedQR = localStorage.getItem('userQR');

    if (!storedUserData || !storedQR) {
        router.push('/register');
        return;
    }

    userData.value = JSON.parse(storedUserData);
    qrCode.value = storedQR;
});

const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userQR');
    router.push('/register');
};
</script>
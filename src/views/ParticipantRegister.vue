<template>
    <div class="register-form">
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label>DNI:</label>
                <input v-model="formData.dni" type="text" required>
            </div>
            <div class="form-group">
                <label>Código:</label>
                <input v-model="formData.code" type="text" required>
            </div>
            <div class="form-group">
                <label>Nombres Completos:</label>
                <input v-model="formData.fullName" type="text" required>
            </div>
            <button type="submit">Registrar</button>
        </form>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import QRCode from 'qrcode';

const router = useRouter();
const userStore = useUserStore();

const formData = ref({
    dni: '',
    code: '',
    fullName: ''
});

const handleSubmit = async () => {
    try {
        const exists = await userStore.validateDNI(formData.value.dni);
        if (!exists) {
            alert('DNI no encontrado en la base de datos');
            return;
        }

        const success = await userStore.updateParticipantStatus(formData.value.dni);
        if (success) {
            console.log('Participante registrado exitosamente');
            console.log(success)
            // Generar QR
            const qrCode = await QRCode.toDataURL(formData.value.dni);
            localStorage.setItem('userQR', qrCode);
            localStorage.setItem('userInfo', JSON.stringify(formData.value));
            router.push('/participant-details');
        }
    } catch (error) {
        console.error('Error en registro:', error);
    }
};
</script>
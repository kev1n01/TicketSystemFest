<template>
    <div class="container">
        <div class="form-container">
            <h2 class="text-center mb-4">Acceso Administrativo</h2>

            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="username">Usuario:</label>
                    <input id="username" v-model="username" type="text" required placeholder="Ingrese su usuario"
                        :class="{ 'error': error }">
                </div>

                <div class="form-group">
                    <label for="password">Contraseña:</label>
                    <input id="password" v-model="password" type="password" required placeholder="Ingrese su contraseña"
                        :class="{ 'error': error }">
                </div>

                <div v-if="error" class="alert alert-error mb-3">
                    {{ errorMessage }}
                </div>

                <button type="submit" class="btn btn-primary w-full" :disabled="loading">
                    <span v-if="loading" class="loading-spinner"></span>
                    <span v-else>Iniciar Sesión</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const error = ref(false);
const errorMessage = ref('');
const loading = ref(false);

const handleLogin = async () => {
    try {
        loading.value = true;
        error.value = false;

        const isValidAdmin = await userStore.validateAdmin(username.value);

        if (!isValidAdmin) {
            error.value = true;
            errorMessage.value = 'Credenciales inválidas';
            return;
        }

        // En un caso real, aquí validarías también la contraseña
        // Por ahora solo guardamos la sesión del admin
        localStorage.setItem('adminSession', JSON.stringify({
            username: username.value,
            timestamp: new Date().getTime()
        }));

        router.push('/scanner');
    } catch (err) {
        error.value = true;
        errorMessage.value = 'Error al iniciar sesión';
        console.error('Login error:', err);
    } finally {
        loading.value = false;
    }
};
</script>
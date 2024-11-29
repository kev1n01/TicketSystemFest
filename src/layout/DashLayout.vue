<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";
import { Terminal, Ticket, LogOut, HistoryIcon, Menu, X, Scan, CircleGauge, Upload } from "lucide-vue-next";
import { useRouter, useRoute } from "vue-router";
import speaker from "../speaker";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// Estado para controlar el menú móvil
const menuAbierto = ref(false);

const toggleMenu = () => {
    menuAbierto.value = !menuAbierto.value;
};

// Función para manejar el logout
const handleLogout = (redirect = "/home") => {
    if (redirect === "/admin") {
        speaker(`Adiós admin de mi corazón`);
    } else {
        speaker(`Adiós ${userStore.userFullName}`);
    }
    userStore.logout();
    router.push(redirect);
};

// Función para verificar si un enlace está activo
const esRutaActiva = (ruta) => route.path === ruta;
</script>

<template>
    <div
        class="flex items-center justify-center min-h-screen h-max bg-gradient-to-br from-red-900 to-black text-white px-4 sm:px-6 lg:px-8 font-epilogue mb-0">

        <nav
            class="2xl:mx-80 xl:mx-48 lg:mx-42 md:mx-42 sm:mx-32 mx-5 lg:px-12 xs:px-5 p-4 backdrop-blur-2xl bg-black/70 fixed top-0 left-0 right-0 z-50 border border-white/20 rounded-3xl rounded-tr-none rounded-tl-none">
            <div class="flex items-center justify-between text-white font-epilogue font-semibold">
                <!-- Logo -->
                <a href="/home" class="hover:scale-105 transition-transform font-semibold text-2xl">
                    <div class="flex items-center content-center">
                        <span class="pt-1 mr-1">PAISI</span>
                        <Terminal />
                    </div>
                </a>

                <!-- Botón de menú para pantallas pequeñas -->
                <button class="lg:hidden block" @click="toggleMenu" aria-label="Toggle menu">
                    <Menu v-if="!menuAbierto" class="w-6 h-6" />
                    <X v-else class="w-6 h-6" />
                </button>

                <!-- Menú Desktop -->
                <div class="hidden lg:flex items-center xs:gap-2 md:gap-12 font-semibold">
                    <a href="/view-ticket" v-if="userStore.userCode || userStore.userDni"
                        class="cursor-pointer flex items-center content-center gap-1"
                        :class="[esRutaActiva('/view-ticket') ? 'text-red-300' : 'text-white']">
                        <Ticket class="w-5 h-5" />
                        Mi Ticket
                    </a>
                    <a href="/lottery" v-if="userStore.username"
                        class="cursor-pointer flex items-center content-center gap-1"
                        :class="[esRutaActiva('/lottery') ? 'text-blue-300' : 'text-white']">
                        <CircleGauge class="w-5 h-5" />
                        Sorteo
                    </a>
                    <a href="/view-winner" v-if="userStore.userCode || userStore.userDni"
                        class="cursor-pointer flex items-center content-center gap-1"
                        :class="[esRutaActiva('/view-winner') ? 'text-red-300' : 'text-white']">
                        <CircleGauge class="w-5 h-5" />
                        Ver sorteo
                    </a>
                    <a href="/historial-register" v-if="userStore.username"
                        class="cursor-pointer flex items-center content-center gap-1"
                        :class="[esRutaActiva('/historial-register') ? 'text-blue-300' : 'text-white']">
                        <HistoryIcon class="w-5 h-5" />
                        Historial
                    </a>
                    <a href="/scanner" v-if="userStore.username"
                        class="cursor-pointer flex items-center content-center gap-1"
                        :class="[esRutaActiva('/scanner') ? 'text-blue-300' : 'text-white']">
                        <Scan class="w-5 h-5" />
                        Escanear
                    </a>
                    <!-- <a href="/upload-data" v-if="userStore.username"
                        class="cursor-pointer flex items-center content-center gap-1"
                        :class="[esRutaActiva('/upload-data') ? 'text-blue-300' : 'text-white']">
                        <Upload class="w-5 h-5" />
                        Subir
                    </a> -->
                    <button type="button" @click="handleLogout(userStore.username ? '/admin' : '/home')"
                        class="flex items-center content-center gap-1 shadow-[0_2px_6px_#ff0000] p-2 rounded-lg hover:shadow-md"
                        :class="{ 'shadow-blue-500/80 hover:shadow-blue-500': userStore.username, 'shadow-red-500/80 hover:shadow-red-500': !userStore.username }">
                        <LogOut class="w-5 h-5" />
                        Salir
                    </button>
                </div>
            </div>

            <!-- Menú móvil -->
            <div v-if="menuAbierto" class="lg:hidden flex flex-col items-center mt-4 space-y-4 font-semibold">
                <a href="/view-ticket" v-if="userStore.userCode || userStore.userDni"
                    class="cursor-pointer flex items-center content-center gap-1"
                    :class="[esRutaActiva('/view-ticket') ? 'text-red-300' : 'text-white']">
                    <Ticket class="w-5 h-5" />
                    Mi Ticket
                </a>
                <a href="/view-winner" v-if="userStore.userCode || userStore.userDni"
                    class="cursor-pointer flex items-center content-center gap-1"
                    :class="[esRutaActiva('/view-winner') ? 'text-red-300' : 'text-white']">
                    <CircleGauge class="w-5 h-5" />
                    Ver sorteo
                </a>
                <a href="/lottery" v-if="userStore.username"
                    class="cursor-pointer flex items-center content-center gap-1"
                    :class="[esRutaActiva('/lottery') ? 'text-blue-300' : 'text-white']">
                    <CircleGauge class="w-5 h-5" />
                    Sorteo
                </a>
                <a href="/historial-register" v-if="userStore.username"
                    class="cursor-pointer flex items-center content-center gap-1"
                    :class="[esRutaActiva('/historial-register') ? 'text-blue-300' : 'text-white']">
                    <HistoryIcon class="w-5 h-5" />
                    Historial
                </a>
                <a href="/scanner" v-if="userStore.username"
                    class="cursor-pointer flex items-center content-center gap-1"
                    :class="[esRutaActiva('/scanner') ? 'text-blue-300' : 'text-white']">
                    <Scan class="w-5 h-5" />
                    Escanear
                </a>
                <!-- <a href="/upload-data" v-if="userStore.username"
                    class="cursor-pointer flex items-center content-center gap-1"
                    :class="[esRutaActiva('/upload-data') ? 'text-blue-300' : 'text-white']">
                    <Upload class="w-5 h-5" />
                    Subir
                </a> -->
                <button type="button" @click="handleLogout(userStore.username ? '/admin' : '/home')"
                    class="flex items-center content-center gap-1 shadow-[0_2px_6px_#ff0000] p-2 rounded-lg hover:shadow-md w-full text-center justify-center"
                    :class="{ 'shadow-blue-500/80 hover:shadow-blue-500': userStore.username, 'shadow-red-500/80 hover:shadow-red-500': !userStore.username }">
                    <LogOut class="w-5 h-5" />
                    Salir
                </button>
            </div>
        </nav>

        <slot />
    </div>
</template>

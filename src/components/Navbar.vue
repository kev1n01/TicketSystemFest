<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Menu, X, Terminal } from 'lucide-vue-next'
import { useUserStore } from '../stores/userStore';

const isMenuOpen = ref(false)
const activeHash = ref("#header"); // Fragmento activo inicial
const route = useRoute();
const userStore = useUserStore();

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

// Actualizar el hash activo al cambiar de ruta
watch(
    () => route.hash,
    (newHash) => {
        activeHash.value = newHash || "#header";
    },
    { immediate: true }
);

</script>
<template>
    <nav
        class="2xl:mx-80 xl:mx-48 lg:mx-42 md:mx-42 sm:mx-32 mx-2 lg:px-12 xs:px-5 p-4 backdrop-blur-2xl bg-black/70 fixed top-0 left-0 right-0 z-50 border border-white/20 rounded-3xl mt-2">
        <div class="flex items-center justify-between">
            <!-- Logo -->
            <a href="#inicio" class="hover:scale-105 transition-transform font-semibold text-2xl">
                <div class="flex items-center content-center">
                    <span class="pt-1 mr-1">PAISI</span>
                    <Terminal />
                </div>
            </a>

            <!-- Hamburger Menu Button (Mobile) -->
            <button class="lg:hidden p-2 hover:bg-red-800/50 rounded-lg transition-colors" @click="toggleMenu"
                aria-label="Toggle menu">
                <Menu v-if="!isMenuOpen" class="h-6 w-6" />
                <X v-else class="h-6 w-6" />
            </button>

            <!-- Desktop Menu -->
            <div class="hidden lg:flex items-center gap-12 font-semibold">
                <a href="#inicio" :class="activeHash === '#inicio' ? 'text-red-300 font-bold' : 'hover:text-red-300'"
                    class="transition-colors cursor-pointer">Inicio</a>
                <a href="https://maps.app.goo.gl/86TGP1KvfbczNvyb8" target="_blank"
                    class="hover:text-red-300 transition-colors cursor-pointer">Ubicación</a>
                <a href="#paquetes"
                    :class="activeHash === '#paquetes' ? 'text-red-300 font-bold' : 'hover:text-red-300'"
                    class="transition-colors cursor-pointer">Paquetes</a>
                <a href="#auspiciadores"
                    :class="activeHash === '#auspiciadores' ? 'text-red-300 font-bold' : 'hover:text-red-300'"
                    class="transition-colors cursor-pointer">Auspiciadores</a>
                <a href="/generate-ticket"
                    class="bg-red-800/80 hover:bg-red-700 px-6 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-red-500/20">
                    {{ userStore.userHashCode ? "Ver mi ticket" : "Ingresar" }}
                </a>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div v-show="isMenuOpen" class="lg:hidden mt-4 py-4 px-2 bg-black/50 backdrop-blur-md rounded-xl text-center">
            <div class="flex flex-col gap-4">
                <a href="https://maps.app.goo.gl/86TGP1KvfbczNvyb8" target="_blank"
                    class="px-4 py-2 hover:bg-red-800/30 rounded-lg transition-colors border-b-[1px] border-white/25 ">Ubicación</a>
                <a href="#paquetes"
                    class="px-4 py-2 hover:bg-red-800/30 rounded-lg transition-colors border-b-[1px] border-white/25 ">Paquetes</a>
                <a href="#auspiciadores"
                    class="px-4 py-2 hover:bg-red-800/30 rounded-lg transition-colors border-b-[1px] border-white/25">Auspiciadores</a>

            </div>
            <a href="/generate-ticket"
                class="inline-block bg-red-800/80 hover:bg-red-700 px-6 py-2 mt-4 rounded-lg transition-all hover:shadow-lg hover:shadow-red-500/20 w-full">
                {{ userStore.userHashCode ? "Ver mi ticket" : "Ingresar" }}
            </a>
        </div>
    </nav>
</template>

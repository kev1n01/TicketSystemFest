<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { Menu, X, Terminal } from 'lucide-vue-next'
import { useUserStore } from '../stores/userStore';

const isMenuOpen = ref(false)
const activeHash = ref("#header"); // Fragmento activo inicial
const isScrolled = ref(false);
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

const handleScroll = () => {
    isScrolled.value = window.scrollY > 0; // Cambia según la posición del scroll
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <nav :class="[
        'xl:px-4 lg:px-9 sm:px-20 xs:px-10 xl:mx-40 lg:mx-42 md:mx-42 sm:mx-30 py-4 fixed top-0 left-0 right-0 z-50 rounded-3xl my-2 transition-all duration-500',
        isScrolled ? 'xl:mx-44 lg:mx-42 md:mx-42 sm:mx-37 mx-2 bg-black/80 backdrop-blur-lg border border-white/40 shadow-lg xl:mr-60 xl:ml-60 lg:mr-32 lg:ml-32 sm:ml-11 sm:mr-11 xs:mr-7 xs:ml-7' : 'border-none bg-transparent backdrop-blur-2xl'
    ]">
        <div class="flex items-center justify-between relative">
            <!-- Logo (centered) -->
            <a href="#inicio" class="flex hover:scale-105 transition-transform font-semibold text-2xl">
                <div class="flex items-center content-center">
                    PAISI
                    <Terminal />
                </div>
            </a>

            <!-- Center Menu -->
            <div class="hidden lg:flex items-center gap-12 font-semibold mx-auto">
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
            </div>

            <!-- Button (Right) -->
            <div class="hidden lg:block">
                <a href="/generate-ticket"
                    class="bg-red-800/80 hover:bg-red-700 px-6 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-red-500/20">
                    {{ userStore.userHashCode ? "Ver mi ticket" : "Ingresar" }}
                </a>
            </div>

            <!-- Hamburger Menu (Mobile) -->
            <button @click="toggleMenu" class="lg:hidden p-2 rounded-md hover:bg-gray-800/40">
                <Menu v-if="!isMenuOpen" class="h-6 w-6 text-white" />
                <X v-else class="h-6 w-6 text-white" />
            </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="isMenuOpen" class="lg:hidden mt-4 py-4 px-2 bg-black/80 backdrop-blur-lg rounded-xl text-center">
            <div class="flex flex-col gap-4">
                <a href="#inicio" :class="activeHash === '#inicio' ? 'text-red-300 font-bold' : 'hover:text-red-300'"
                    class="px-4 py-2 transition-colors cursor-pointer">Inicio</a>
                <a href="https://maps.app.goo.gl/86TGP1KvfbczNvyb8" target="_blank"
                    class="px-4 py-2 hover:text-red-300 transition-colors cursor-pointer">Ubicación</a>
                <a href="#paquetes"
                    :class="activeHash === '#paquetes' ? 'text-red-300 font-bold' : 'hover:text-red-300'"
                    class="px-4 py-2 transition-colors cursor-pointer">Paquetes</a>
                <a href="#auspiciadores"
                    :class="activeHash === '#auspiciadores' ? 'text-red-300 font-bold' : 'hover:text-red-300'"
                    class="px-4 py-2 transition-colors cursor-pointer">Auspiciadores</a>
                <a href="/generate-ticket"
                    class="inline-block bg-red-800/80 hover:bg-red-700 px-6 py-2 mt-4 rounded-lg transition-all hover:shadow-lg hover:shadow-red-500/20">
                    {{ userStore.userHashCode ? "Ver mi ticket" : "Ingresar" }}
                </a>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { Menu, X } from "lucide-vue-next";
import { useUserStore } from "../stores/userStore";
import SessionMenu from "./SessionMenu.vue";

const isMenuOpen = ref(false);
const isScrolled = ref(false);
const activeSection = ref("#inicio");
const userStore = useUserStore();

// An admin or a participant with a ticket sees the session menu
const hasSession = computed(() =>
    Boolean(userStore.username) || Boolean(userStore.userQr && (userStore.userCode || userStore.userDni))
);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const updateActiveSection = () => {
    const sections = [
        { id: "#inicio", element: document.querySelector("#inicio") },
        { id: "#paquetes", element: document.querySelector("#paquetes") },
        { id: "#auspiciadores", element: document.querySelector("#auspiciadores") },
        { id: "#ubicacion", element: document.querySelector("#ubicacion") },
    ];

    for (const section of sections) {
        if (section.element) {
            const rect = section.element.getBoundingClientRect();
            if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
                activeSection.value = section.id;
                break;
            }
        }
    }
};

const handleScroll = () => {
    isScrolled.value = window.scrollY > 0;
    updateActiveSection();
};

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
    updateActiveSection();
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
    <nav class="fixed inset-x-0 top-3 z-50 mx-auto w-[calc(100%-1.5rem)] max-w-5xl">
        <div class="glass-panel flex items-center justify-between gap-4 rounded-2xl px-3 py-2 transition-colors duration-300 sm:px-4"
            :class="isScrolled ? 'bg-night/75' : 'bg-night/35'">
            <!-- Logo -->
            <a href="#inicio" class="flex min-h-11 shrink-0 items-center gap-1.5 px-1 text-xl font-bold tracking-tight">
                <span class="pt-0.5">PAISI</span>
            </a>

            <!-- Derecha: enlaces (desktop), sesión y menú hamburguesa (móvil). El CTA vive en el hero. -->
            <div class="flex min-w-0 items-center gap-1">
                <div class="hidden items-center gap-1 lg:flex">
                    <a href="#inicio" class="nav-link"
                        :class="activeSection === '#inicio' ? 'nav-active' : 'text-white/70 hover:text-white'"
                        :aria-current="activeSection === '#inicio' ? 'location' : undefined">
                        Inicio
                    </a>
                    <a href="#ubicacion" class="nav-link"
                        :class="activeSection === '#ubicacion' ? 'nav-active' : 'text-white/70 hover:text-white'"
                        :aria-current="activeSection === '#ubicacion' ? 'location' : undefined">
                        Ubicación
                    </a>
                    <a href="#paquetes" class="nav-link"
                        :class="activeSection === '#paquetes' ? 'nav-active' : 'text-white/70 hover:text-white'"
                        :aria-current="activeSection === '#paquetes' ? 'location' : undefined">
                        Paquetes
                    </a>
                    <a href="#auspiciadores" class="nav-link"
                        :class="activeSection === '#auspiciadores' ? 'nav-active' : 'text-white/70 hover:text-white'"
                        :aria-current="activeSection === '#auspiciadores' ? 'location' : undefined">
                        Auspiciadores
                    </a>
                </div>

                <SessionMenu v-if="hasSession" class="lg:ml-2" @open="isMenuOpen = false" />

                <button type="button" @click="toggleMenu"
                    class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-white/5 lg:hidden"
                    :aria-expanded="isMenuOpen" aria-controls="menu-movil"
                    :aria-label="isMenuOpen ? 'Cerrar menú' : 'Abrir menú'">
                    <Menu v-if="!isMenuOpen" class="h-6 w-6" />
                    <X v-else class="h-6 w-6" />
                </button>
            </div>
        </div>

        <!-- Menú móvil -->
        <div v-if="isMenuOpen" id="menu-movil" class="glass-panel mt-2 flex flex-col gap-1 rounded-2xl p-2 lg:hidden"
            @click="(event) => { if (event.target.closest('a')) isMenuOpen = false; }">
            <a href="#inicio" class="mobile-link"
                :class="activeSection === '#inicio' ? 'nav-active-side' : 'text-white/80 hover:text-white'"
                :aria-current="activeSection === '#inicio' ? 'location' : undefined">
                Inicio
            </a>
            <a href="#ubicacion" class="mobile-link"
                :class="activeSection === '#ubicacion' ? 'nav-active-side' : 'text-white/80 hover:text-white'"
                :aria-current="activeSection === '#ubicacion' ? 'location' : undefined">
                Ubicación
            </a>
            <a href="#paquetes" class="mobile-link"
                :class="activeSection === '#paquetes' ? 'nav-active-side' : 'text-white/80 hover:text-white'"
                :aria-current="activeSection === '#paquetes' ? 'location' : undefined">
                Paquetes
            </a>
            <a href="#auspiciadores" class="mobile-link"
                :class="activeSection === '#auspiciadores' ? 'nav-active-side' : 'text-white/80 hover:text-white'"
                :aria-current="activeSection === '#auspiciadores' ? 'location' : undefined">
                Auspiciadores
            </a>
        </div>
    </nav>
</template>

<style scoped>
.nav-link {
    @apply inline-flex min-h-11 items-center rounded-xl px-3.5 text-sm font-semibold transition-colors;
}

.mobile-link {
    @apply flex min-h-11 items-center rounded-xl px-4 py-3 font-semibold transition-colors;
}
</style>

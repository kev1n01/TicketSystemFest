<script setup>
import { computed, ref } from "vue";
import { useUserStore } from "../stores/userStore";
import { Terminal, Ticket, LogOut, HistoryIcon, Menu, X, ScanLine, Shuffle, Trophy } from "lucide-vue-next";
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

const isAdmin = computed(() => Boolean(userStore.username));

// Enlaces visibles según el tipo de sesión
const links = computed(() => {
    if (isAdmin.value) {
        return [
            { href: "/scanner", label: "Escanear", icon: ScanLine },
            { href: "/historial-register", label: "Historial", icon: HistoryIcon },
            { href: "/lottery", label: "Sorteo", icon: Shuffle },
        ];
    }
    if (userStore.userCode || userStore.userDni) {
        return [
            { href: userStore.userDni ? "/view-ticket-guess" : "/view-ticket", label: "Mi ticket", icon: Ticket },
            { href: "/view-winner", label: "Ganadores", icon: Trophy },
        ];
    }
    return [];
});

// Función para manejar el logout
const handleLogout = () => {
    const redirect = isAdmin.value ? "/admin" : "/home";
    if (isAdmin.value) {
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
    <div class="flex min-h-screen flex-col items-center px-4 pb-16 pt-28 text-white sm:px-6">
        <nav class="fixed inset-x-0 top-3 z-40 mx-auto w-[calc(100%-1.5rem)] max-w-5xl">
            <div class="glass-panel flex items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
                <a href="/home" class="flex items-center gap-1.5 text-xl font-bold tracking-tight">
                    <span class="pt-0.5">PAISI</span>
                    <Terminal class="h-5 w-5 text-flare" />
                </a>

                <!-- Menú Desktop -->
                <div class="hidden items-center gap-1 lg:flex">
                    <a v-for="link in links" :key="link.href" :href="link.href"
                        class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors"
                        :class="esRutaActiva(link.href)
                            ? (isAdmin ? 'bg-lilac/20 text-white' : 'bg-ember/20 text-white')
                            : 'text-white/70 hover:bg-white/5 hover:text-white'"
                        :aria-current="esRutaActiva(link.href) ? 'page' : undefined">
                        <component :is="link.icon" class="h-4 w-4" />
                        {{ link.label }}
                    </a>
                    <button type="button" @click="handleLogout"
                        class="ml-2 flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:border-white/30 hover:text-white">
                        <LogOut class="h-4 w-4" />
                        Salir
                    </button>
                </div>

                <!-- Botón de menú para pantallas pequeñas -->
                <button class="rounded-lg p-1 lg:hidden" @click="toggleMenu" :aria-expanded="menuAbierto"
                    aria-label="Abrir menú">
                    <Menu v-if="!menuAbierto" class="h-6 w-6" />
                    <X v-else class="h-6 w-6" />
                </button>
            </div>

            <!-- Menú móvil -->
            <div v-if="menuAbierto" class="glass-panel mt-2 flex flex-col gap-1 rounded-2xl p-2 lg:hidden">
                <a v-for="link in links" :key="link.href" :href="link.href"
                    class="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold"
                    :class="esRutaActiva(link.href)
                        ? (isAdmin ? 'bg-lilac/20' : 'bg-ember/20')
                        : 'text-white/80 hover:bg-white/5'"
                    :aria-current="esRutaActiva(link.href) ? 'page' : undefined">
                    <component :is="link.icon" class="h-5 w-5" />
                    {{ link.label }}
                </a>
                <button type="button" @click="handleLogout"
                    class="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-white/80 hover:bg-white/5">
                    <LogOut class="h-5 w-5" />
                    Salir
                </button>
            </div>
        </nav>

        <slot />
    </div>
</template>

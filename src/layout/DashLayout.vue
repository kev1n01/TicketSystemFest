<script setup>
import { computed, ref } from "vue";
import { useUserStore } from "../stores/userStore";
import { Ticket, LogOut, HistoryIcon, Menu, X, ScanLine, Shuffle, Trophy } from "lucide-vue-next";
import { useRouter, useRoute } from "vue-router";
import SessionMenu from "../components/SessionMenu.vue";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// Estado para controlar el menú móvil
const menuAbierto = ref(false);

const toggleMenu = () => {
    menuAbierto.value = !menuAbierto.value;
};

const isAdmin = computed(() => Boolean(userStore.username));

// Identidad mostrada en el menú móvil (en desktop la muestra SessionMenu)
const sessionName = computed(() => (isAdmin.value ? userStore.username : userStore.userFullName) ?? "");
const sessionRole = computed(() => {
    if (isAdmin.value) return "Staff";
    if (userStore.userCode) return "Estudiante";
    if (userStore.userDni) return "Invitado";
    return "";
});

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
    userStore.logout();
    router.push(redirect);
};

// Función para verificar si un enlace está activo
const esRutaActiva = (ruta) => route.path === ruta;
</script>

<template>
    <div class="flex min-h-screen flex-col items-center px-4 pb-16 pt-28 text-white sm:px-6">
        <nav class="fixed inset-x-0 top-3 z-40 mx-auto w-[calc(100%-1.5rem)] max-w-5xl">
            <div class="glass-panel flex items-center justify-between gap-4 rounded-2xl px-3 py-2 sm:px-4">
                <a href="/home" class="flex min-h-11 shrink-0 items-center gap-1.5 px-1 text-xl font-bold tracking-tight">
                    <span class="pt-0.5">PAISI</span>
                </a>

                <!-- Menú Desktop -->
                <div class="hidden items-center gap-1 lg:flex">
                    <a v-for="link in links" :key="link.href" :href="link.href"
                        class="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors"
                        :class="esRutaActiva(link.href)
                            ? 'nav-active'
                            : 'text-white/70 hover:text-white'"
                        :aria-current="esRutaActiva(link.href) ? 'page' : undefined">
                        <component :is="link.icon" class="h-4 w-4" />
                        {{ link.label }}
                    </a>
                    <SessionMenu class="ml-2" />
                </div>

                <!-- Botón de menú para pantallas pequeñas -->
                <button type="button"
                    class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-white/5 lg:hidden"
                    @click="toggleMenu" :aria-expanded="menuAbierto" aria-controls="menu-dash-movil"
                    :aria-label="menuAbierto ? 'Cerrar menú' : 'Abrir menú'">
                    <Menu v-if="!menuAbierto" class="h-6 w-6" />
                    <X v-else class="h-6 w-6" />
                </button>
            </div>

            <!-- Menú móvil -->
            <div v-if="menuAbierto" id="menu-dash-movil" class="glass-panel mt-2 flex flex-col gap-1 rounded-2xl p-2 lg:hidden">
                <div v-if="sessionName" class="px-4 pb-2 pt-2">
                    <p class="break-words font-semibold">{{ sessionName }}</p>
                    <p class="text-sm text-white/60">{{ sessionRole }}</p>
                </div>
                <a v-for="link in links" :key="link.href" :href="link.href"
                    class="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold"
                    :class="esRutaActiva(link.href)
                        ? 'nav-active-side'
                        : 'text-white/80 hover:text-white'"
                    :aria-current="esRutaActiva(link.href) ? 'page' : undefined">
                    <component :is="link.icon" class="h-5 w-5" />
                    {{ link.label }}
                </a>
                <div class="my-1 border-t border-white/10" aria-hidden="true"></div>
                <button type="button" @click="handleLogout"
                    class="flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold text-white/80 hover:bg-white/5">
                    <LogOut class="h-5 w-5" />
                    Cerrar sesión
                </button>
            </div>
        </nav>

        <slot />
    </div>
</template>

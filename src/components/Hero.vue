<script setup>
import { computed } from "vue";
import EventTicket from "./EventTicket.vue";
import ShimmerButton from "./ShimmerButton.vue";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

// Admin wins when both sessions coexist, as in DashLayout
const isAdmin = computed(() => Boolean(userStore.username));
const isParticipant = computed(() =>
    !isAdmin.value && Boolean(userStore.userQr && (userStore.userCode || userStore.userDni))
);
</script>
<template>
    <section id="hero" class="flex flex-col">
        <!-- Presentación: el título es la pieza central sobre el aura -->
        <div class="flex flex-col items-center justify-center py-12 text-center sm:py-16"
            :class="isParticipant ? 'min-h-[44vh]' : 'min-h-[64vh]'">
            <p class="text-lg font-semibold sm:text-xl">32 aniversario</p>
            <p class="mt-1 text-base text-white/70 sm:text-lg">Ingeniería de Sistemas e Informática</p>

            <h1
                class="mt-6 font-dastress text-[clamp(3.25rem,16vw,9.5rem)] leading-none tracking-wider text-shadow-redGlow animate-pulse2 sm:mt-8">
                System Fest
            </h1>

            <ul class="mt-8 flex flex-wrap justify-center gap-2 text-sm sm:mt-10 sm:gap-3 sm:text-base">
                <li class="fact-chip">29 de noviembre</li>
                <li class="fact-chip">01:00 PM hasta el día siguiente</li>
                <li class="fact-chip">Mistika casa club</li>
            </ul>

            <!-- Sin sesión: un solo punto de entrada; estudiante o invitado se elige en el formulario -->
            <div v-if="!isParticipant && !isAdmin" id="generate" class="mt-10 flex scroll-mt-24 flex-col items-center sm:mt-12">
                <ShimmerButton to="/generate-ticket">Generar ticket</ShimmerButton>
                <p class="mt-3 text-sm text-white/65">Estudiante o invitado: lo eliges en el siguiente paso.</p>
            </div>
        </div>

        <!-- Participante con sesión: su ticket listo para mostrar en la entrada.
             En móvil va primero para que el QR se vea sin hacer scroll en la puerta. -->
        <div v-if="isParticipant" id="generate"
            class="scroll-mt-24 pb-16 max-md:order-first max-md:pt-6 sm:pb-20 md:grid md:grid-cols-[minmax(0,1fr)_24rem] md:items-start md:gap-10">
            <!-- En móvil el ticket ya lo dice todo: el encabezado queda solo para lectores de pantalla -->
            <div class="max-md:sr-only">
                <h2 class="text-2xl font-semibold sm:text-3xl">Tu ticket</h2>
                <p class="mt-2 max-w-md text-white/70">Muéstralo en la entrada para registrar tu ingreso.</p>
            </div>

            <div class="mx-auto mt-6 w-full max-w-sm md:mt-0">
                <EventTicket title-tag="p" :full-name="userStore.userFullName"
                    :id-label="userStore.userDni ? 'DNI' : 'Código'"
                    :id-value="userStore.userDni ? userStore.userDni : userStore.userCode"
                    :type="userStore.userDni ? 'invitado' : 'estudiante'" :qr-code="userStore.userQr" />
            </div>
        </div>

        <!-- Staff con sesión: accesos directos -->
        <div v-else-if="isAdmin" id="generate" class="scroll-mt-24 pb-16 sm:pb-20">
            <h2 class="text-2xl font-semibold sm:text-3xl">Panel de staff</h2>
            <p class="mt-2 max-w-xl text-white/70">
                Escanea los tickets en la entrada, revisa el historial de ingresos o inicia el sorteo.
            </p>

            <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <RouterLink to="/scanner" class="btn-primary min-h-11">Escanear tickets</RouterLink>
                <RouterLink to="/historial-register" class="btn-secondary min-h-11">Historial de ingresos</RouterLink>
                <RouterLink to="/lottery" class="btn-secondary min-h-11">Sorteo</RouterLink>
            </div>
        </div>
    </section>
</template>

<style scoped>
.fact-chip {
    @apply inline-flex items-center rounded-full border border-white/10 bg-night/45 px-4 py-2 backdrop-blur-md;
}
</style>

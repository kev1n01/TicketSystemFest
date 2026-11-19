<script setup>
import ButtonPrimarySecondEffect from './ButtonPrimarySecondEffect.vue';
import { useUserStore } from "../stores/userStore";
import { CalendarDays, Clock, MapPin, IdCard, GraduationCap } from "lucide-vue-next";

const userStore = useUserStore();
</script>
<template>
    <section id="hero">
        <!-- Presentación: el título es la pieza central sobre el aura -->
        <div class="flex min-h-[64vh] flex-col items-center justify-center py-12 text-center sm:py-16">
            <p class="text-lg font-semibold sm:text-xl">32 aniversario</p>
            <p class="mt-1 text-base text-white/70 sm:text-lg">Ingeniería de Sistemas e Informática</p>

            <h1
                class="hero-title mt-6 font-dastress text-[clamp(3.25rem,16vw,9.5rem)] leading-none tracking-wider animate-pulse2 sm:mt-8">
                System Fest
            </h1>

            <ul class="mt-8 flex flex-wrap justify-center gap-2 text-sm sm:mt-10 sm:gap-3 sm:text-base">
                <li class="fact-chip">
                    <CalendarDays class="h-4 w-4 shrink-0 text-flare" aria-hidden="true" />
                    29 de noviembre
                </li>
                <li class="fact-chip">
                    <Clock class="h-4 w-4 shrink-0 text-flare" aria-hidden="true" />
                    01:00 PM hasta el día siguiente
                </li>
                <li class="fact-chip">
                    <MapPin class="h-4 w-4 shrink-0 text-flare" aria-hidden="true" />
                    Mistika casa club
                </li>
            </ul>
        </div>

        <!-- Generar tickets -->
        <div id="generate" class="scroll-mt-24 pb-16 sm:pb-20">
            <h2 class="text-2xl font-semibold sm:text-3xl">Genera tu ticket</h2>
            <p class="mt-2 max-w-xl text-white/70">
                Para ingresar al evento necesitas tu ticket digital con código QR. Elige cómo generarlo.
            </p>

            <div class="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6">
                <article class="glass-panel flex flex-col p-6 sm:p-8">
                    <div class="flex items-center gap-3">
                        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                            <IdCard class="h-5 w-5 text-flare" aria-hidden="true" />
                        </span>
                        <h3 class="text-xl font-semibold">Invitado</h3>
                    </div>
                    <p class="mt-4 flex-1 text-white/70">Usa tu DNI para generar tu ticket de invitado.</p>
                    <ButtonPrimarySecondEffect class="mt-6 w-full"
                        :label="userStore.userHashCode != null ? 'Ver mi ticket' : 'Generar ticket'"
                        :link="userStore.userHashCode == null ? '/generate-ticket-guess' : (userStore.userDni ? '/view-ticket-guess' : '/view-ticket')" />
                </article>

                <article class="glass-panel flex flex-col p-6 sm:p-8">
                    <div class="flex items-center gap-3">
                        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                            <GraduationCap class="h-5 w-5 text-flare" aria-hidden="true" />
                        </span>
                        <h3 class="text-xl font-semibold">Estudiante</h3>
                    </div>
                    <p class="mt-4 flex-1 text-white/70">Usa tu código de estudiante para generar tu ticket.</p>
                    <ButtonPrimarySecondEffect class="mt-6 w-full"
                        :label="userStore.userHashCode != null ? 'Ver mi ticket' : 'Generar ticket'"
                        :link="userStore.userHashCode == null ? '/generate-ticket' : (userStore.userDni ? '/view-ticket-guess' : '/view-ticket')" />
                </article>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* Brillo ember atenuado: el neón del cartel, sin saturar el aura */
.hero-title {
    text-shadow:
        0 0 12px rgb(218 70 70 / 0.6),
        0 0 36px rgb(218 70 70 / 0.35),
        0 0 80px rgb(248 104 196 / 0.2);
}

.fact-chip {
    @apply inline-flex items-center gap-2 rounded-full border border-white/10 bg-night/45 px-4 py-2 backdrop-blur-md;
}
</style>

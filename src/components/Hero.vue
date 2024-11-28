<script setup>
import ButtonPrimarySecondEffect from './ButtonPrimarySecondEffect.vue';
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
</script>
<template>
    <section id="hero">
        <div class="relative min-h-[70vh] w-full overflow-hidden">
            <!-- Background Image -->
            <img src="https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="tech fest background" class="absolute inset-0 w-full h-full object-cover opacity-70" id="img_hero">

            <!-- Overlay gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/100 to-red-900/60 opacity-40">
            </div>

            <!-- Content -->
            <div class="relative min-h-[70vh] flex items-center justify-center">
                <div class="text-center space-y-10 px-4">
                    <div class="font-semibold lg:text-2xl text-xl animate-fade-in-down font-epilogue">
                        <p> 32 aniversario</p>
                        <span>Ingeniería de sistemas e informática</span>
                    </div>

                    <h1 class="text-6xl md:text-[9rem] leading-none font-bold animate-pulse2 font-dastress tracking-wider text-shadow-redGlow">
                        System Fest
                    </h1>

                    <div class="flex flex-wrap justify-center gap-4 text-sm sm:text-base md:text-lg animate-fade-in-up">
                        <span class="w-autotext-center bg-red-200/10 rounded-lg px-4 sm:px-3 py-2  backdrop-blur-md">
                            Noviembre 29
                        </span>
                        <span class="w-autotext-center bg-red-200/10 rounded-lg px-4 sm:px-3 py-2  backdrop-blur-md">
                            01:00 PM - next day
                        </span>
                        <span class="w-autotext-center bg-red-200/10 rounded-lg px-4 sm:px-3 py-2  backdrop-blur-md">
                            Mistika casa club
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Generar tickets-->
        <div
            class="grid md:grid-cols-3 gap-8 pb-10 bg-red-900/25 backdrop-blur-sm p-10 xs:mx-2 rounded-3xl border border-white/30 hover:shadow-red-500/20 hover:shadow-xl mt-[-30px] 2xl:mt-[-100px]" id="generate">
            <div class="items-center content-center">
                <h2 class="text-2xl font-bold mb-2 xs:text-center md:text-left">Genera tu ticket ahora</h2>
                <p>Para ingresar al evento, primero debes generar tu ticket digital como invitado o estudiante.
                </p>
            </div>
            <div class="group">
                <div class="pt-8 px-6 rounded-xl bg-white backdrop-blur-sm text-center transition-all">
                    <h3 class="text-2xl font-bold text-black lg:text-base">Ticket invitado</h3>
                    <p class="py-3 min-h-20 text-black">Genera tu ticket digital como invitado</p>
                    <div class="flex justify-center">
                        <ButtonPrimarySecondEffect
                            class="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[900px]"
                            :label="userStore.userHashCode != null ? 'Ver mi ticket' : 'Generar'"
                            :link="userStore.userHashCode == null ? '/generate-ticket-guess' : '/view-ticket'" />
                    </div>s
                </div>
            </div>
            <div class="group">
                <div class="pt-8 px-6 rounded-xl bg-white backdrop-blur-sm text-center transition-all">
                    <h3 class="text-2xl font-bold text-black lg:text-base">Ticket estudiante</h3>
                    <p class="py-3 min-h-20 text-black">Genera tu ticket digital de ingreso</p>
                    <div class="flex justify-center">
                        <ButtonPrimarySecondEffect
                            class="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[900px]"
                            :label="userStore.userHashCode != null ? 'Ver mi ticket' : 'Generar'"
                            :link="userStore.userHashCode == null ? '/generate-ticket' : '/view-ticket'" />
                    </div>s
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>

#img_hero {
    mask-image: linear-gradient(to right, transparent, black 50%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 80%, transparent);
}
</style>
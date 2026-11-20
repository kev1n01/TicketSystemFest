<script setup>
import Navbar from '../components/Navbar.vue'
import Hero from '../components/Hero.vue'
import EventSchedule from '../components/EventSchedule.vue'
import Sponsors from '../components/Sponsors.vue'
import LocationMap from '../components/LocationMap.vue'
import Foot from '../components/Foot.vue'
import ButtonToTop from '../components/ButtonToTop.vue'
import CircuitTraces from '../components/CircuitTraces.vue'

const SHOW_SPONSORS = false

</script>

<template>
    <!-- Transparent page: the fixed aura from App.vue shows through -->
    <div class="min-h-screen">
        <header id="inicio">
            <Navbar />
        </header>

        <!-- Fixed circuit traces between the aura and the content -->
        <CircuitTraces />

        <div class="relative z-[1] mx-auto w-full max-w-5xl px-4 sm:px-6">
            <main class="pt-24">
                <!-- Hero -->
                <Hero />

                <!-- Programación del aniversario -->
                <EventSchedule />

                <!-- Auspiciadores: hidden for now. To show them again, set SHOW_SPONSORS to true
                     and add the link back in Navbar.vue -->
                <Sponsors v-if="SHOW_SPONSORS" />

                <!-- Ubicación -->
                <LocationMap />
            </main>

            <ButtonToTop />

            <Foot />
        </div>
    </div>
</template>

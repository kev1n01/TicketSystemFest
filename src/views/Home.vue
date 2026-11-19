<script setup>
import Navbar from '../components/Navbar.vue'
import Hero from '../components/Hero.vue'
import Package from '../components/Package.vue'
import Sponsors from '../components/Sponsors.vue'
import Foot from '../components/Foot.vue'
import ButtonToTop from '../components/ButtonToTop.vue'

</script>

<template>
    <!-- Transparent page: the fixed aura from App.vue shows through -->
    <div class="min-h-screen">
        <header id="inicio">
            <Navbar />
        </header>

        <div class="mx-auto w-full max-w-5xl px-4 sm:px-6">
            <main class="pt-24">
                <!-- Hero -->
                <Hero />

                <!-- Agenda -->
                <Package />

                <!-- Auspiciadores -->
                <Sponsors />
            </main>

            <ButtonToTop />

            <Foot />
        </div>
    </div>
</template>

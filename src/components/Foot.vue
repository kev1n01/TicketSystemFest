<script setup>
import { ref } from 'vue'
import { Github, InstagramIcon } from 'lucide-vue-next'

const yearCurrent = ref(new Date().getFullYear())
</script>
<template>
    <footer
        class="flex flex-col items-center gap-4 border-t border-white/10 py-10 text-center md:flex-row md:justify-between md:text-left">
        <div class="flex items-center gap-3">
            <a href="#inicio" class="py-2 font-dastress text-2xl tracking-wider">System Fest</a>
            <a href="https://github.com/Transformacion-Digital-UDH" target="_blank" rel="noopener noreferrer"
                aria-label="GitHub de Transformación Digital UDH"
                class="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white/70 transition-colors hover:bg-white/5 hover:text-white">
                <Github class="h-5 w-5" aria-hidden="true" />
            </a>
        </div>
        <p class="text-sm text-white/60">© {{ yearCurrent }} System Fest, LTD UDH. Todos los derechos reservados.</p>
    </footer>
</template>

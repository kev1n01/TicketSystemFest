<script setup>
// Google Maps embed by query: no API key required
const mapQuery = "Mistika Casa Club, Jr. La Estancia, Huánuco, Perú";
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
const mapLink = "https://maps.app.goo.gl/86TGP1KvfbczNvyb8";
</script>

<template>
    <section id="ubicacion" class="scroll-mt-24 py-16 sm:py-20">
        <div class="lg:grid lg:grid-cols-3 lg:gap-10">
            <div>
                <h2 class="text-2xl font-semibold sm:text-3xl">Ubicación</h2>
                <address class="mt-2 not-italic text-white/70">
                    Mistika Casa Club, Jr. La Estancia S/N, Urb. Santa María del Huallaga
                </address>
                <a :href="mapLink" target="_blank" rel="noopener noreferrer" class="btn-secondary mt-6 min-h-11">
                    Abrir en Google Maps
                    <span class="sr-only">(se abre en una pestaña nueva)</span>
                </a>
            </div>

            <div class="glass-panel mt-6 p-2 lg:col-span-2 lg:mt-0">
                <iframe :src="mapSrc" title="Mapa de Mistika Casa Club" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade" allowfullscreen
                    class="block aspect-[4/3] w-full rounded-2xl border-0 bg-night/60 sm:aspect-video"></iframe>
            </div>
        </div>
    </section>
</template>

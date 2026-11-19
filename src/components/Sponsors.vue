<script setup>
import { reactive } from 'vue';

const logosSponsors = [
    {
        name: "LTD UDH",
        image: "ltd-compress.webp",
        url: "https://www.facebook.com/UDHPAISI",
        alt: "Laboratorio de transformación digital UDH"
    },
    {
        name: "Paisi UDH",
        image: "paisi-compress.webp",
        url: "https://www.facebook.com/UDHPAISI",
        alt: "Paisi UDH"
    },
    {
        name: "VRI UDH",
        image: "vri-compress.webp",
        url: "https://www.facebook.com/investigacionudh",
        alt: "Vicerrectorado de investigación UDH"
    },
    {
        name: "Makita makis express ",
        image: "makita-compress.webp",
        url: "https://www.facebook.com/makitamakisexpress",
        alt: "Makita makis express"
    },
    {
        name: "Polleria Chiwchi",
        image: "chiwchi-compress.webp",
        url: "https://www.facebook.com/Chiwchialitas",
        alt: "Makita makis express"
    },
    {
        name: "El blog de juancho",
        image: "juancho-compress.webp",
        url: "https://www.youtube.com/@ELBLOGDEJUANCHO",
        alt: "El blog de juancho"
    },
    {
        name: "Resto bar chill out",
        image: "chill_out-compress.webp",
        url: "https://www.facebook.com/ChillOutHuanuco",
        alt: "Resto bar chill out"
    },
    {
        name: "Cilindro central",
        image: "cilindro_central-compress.webp",
        url: "https://www.facebook.com/restaurantecilindrocentral",
        alt: "Cilindro central"
    },
    {
        name: "Pidelo huanuco",
        image: "pidelo-compress.webp",
        url: "https://www.facebook.com/PideloHuanuco",
        alt: "Pidelo huanuco"
    },
    {
        name: "Dfabios comida rapida",
        image: "dfabios-compress.webp",
        url: "https://www.facebook.com/DFABIOS",
        alt: "Dfabios comida rapida"
    },
];


const tooltip = reactive({
    visible: false,
    text: '',
    style: {
        top: '0px',
        left: '0px',
    },
});

const showTooltip = (text, event) => {
    tooltip.text = text;
    tooltip.visible = true;
    moveTooltip(event);
};

const moveTooltip = (event) => {
    tooltip.style.top = `${event.pageY + 10}px`;
    tooltip.style.left = `${event.pageX + 10}px`;
};

const hideTooltip = () => {
    tooltip.visible = false;
};
</script>
<template>
    <section id="auspiciadores" class="scroll-mt-24 py-16 sm:py-20">
        <h2 class="text-2xl font-semibold sm:text-3xl">Auspiciadores</h2>
        <p class="mt-2 text-white/70">Gracias a quienes hacen posible System Fest.</p>

        <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
            <a v-for="(ls, index) in logosSponsors" :key="index" :href="ls.url" target="_blank"
                rel="noopener noreferrer"
                class="block rounded-2xl bg-white p-3 ring-1 ring-white/10 transition-shadow hover:ring-2 hover:ring-flare/70">
                <img :src="`/imgs/${ls.image}`" :alt="ls.name" loading="lazy"
                    class="aspect-square w-full rounded-lg object-contain" @mouseover="showTooltip(ls.name, $event)"
                    @mousemove="moveTooltip($event)" @mouseout="hideTooltip" />
            </a>
        </div>

        <!-- Tooltip: one instance for every logo; keep it outside transformed or blurred ancestors -->
        <div v-show="tooltip.visible" :style="tooltip.style" class="tooltip" aria-hidden="true">
            {{ tooltip.text }}
        </div>
    </section>
</template>

<style scoped>
.tooltip {
    position: absolute;
    z-index: 60;
    pointer-events: none;
    white-space: nowrap;
    padding: 0.375rem 0.75rem;
    border: 1px solid rgb(255 255 255 / 0.15);
    border-radius: 0.75rem;
    background-color: rgb(16 14 11 / 0.85);
    color: #fff;
    font-size: 0.875rem;
    backdrop-filter: blur(8px);
}
</style>

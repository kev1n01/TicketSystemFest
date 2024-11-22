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
    <section id="auspiciadores">
        <div class="py-10 xs:mx-2">
            <h1 class="text-center text-3xl font-semibold pb-10">[ Auspiciadores ]</h1>
            <div class="grid grid-cols-3 gap-3 md:gap-8 max-w-4xl mx-auto">
                <template v-for="(ls, index) in logosSponsors" :key="index">
                    <div
                        class="bg-white backdrop-blur-sm p-4 rounded-xl hover:shadow-xl hover:shadow-red-500/60 transition-all hover:-translate-y-1">
                        <a :href="ls.url" target="_blank">
                            <img :src="`/imgs/${ls.image}`" :alt="ls.name" :data-title="ls.name"
                                class="w-full rounded-lg custom-tooltip" @mouseover="showTooltip(ls.name, $event)"
                                @mousemove="moveTooltip($event)" @mouseout="hideTooltip" />
                        </a>
                    </div>

                    <!-- Tooltip -->
                    <div v-show="tooltip.visible" :style="tooltip.style" class="tooltip">
                        {{ tooltip.text }}
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>

<style scoped>
.tooltip {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 1rem;
    z-index: 1000;
    pointer-events: none;
    white-space: nowrap;
    opacity: 1;
    border: 1px solid rgba(255, 0, 0, 0.377);
    transition: opacity 0.2s ease-in-out;
}

.tooltip.hidden {
    opacity: 0;
    visibility: hidden;
}
</style>
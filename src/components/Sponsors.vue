<script setup>
const logosSponsors = [
    {
        name: "LTD UDH",
        image: "ltd.png",
        url: "https://www.facebook.com/UDHPAISI",
        alt: "Laboratorio de transformación digital UDH"
    },
    {
        name: "Paisi UDH",
        image: "paisi.png",
        url: "https://www.facebook.com/UDHPAISI",
        alt: "Paisi UDH"
    },
    {
        name: "VRI UDH",
        image: "vri.png",
        url: "https://www.facebook.com/investigacionudh",
        alt: "Vicerrectorado de investigación UDH"
    },
    {
        name: "Makita makis express ",
        image: "makita.jpg",
        url: "https://www.facebook.com/makitamakisexpress",
        alt: "Makita makis express"
    },
    {
        name: "Polleria Chiwchi",
        image: "chiwchi.jpg",
        url: "https://www.facebook.com/Chiwchialitas",
        alt: "Makita makis express"
    },
    {
        name: "El blog de juancho",
        image: "juancho.png",
        url: "https://www.youtube.com/@ELBLOGDEJUANCHO",
        alt: "El blog de juancho"
    },
    {
        name: "Resto bar chill out",
        image: "chill_out.jpg",
        url: "https://www.facebook.com/ChillOutHuanuco",
        alt: "Resto bar chill out"
    },
    {
        name: "Cilindro central",
        image: "cilindro_central.jpg",
        url: "https://www.facebook.com/restaurantecilindrocentral",
        alt: "Cilindro central"
    },
    {
        name: "Pidelo huanuco",
        image: "pidelo.jpg",
        url: "https://www.facebook.com/PideloHuanuco",
        alt: "Pidelo huanuco"
    },
    {
        name: "Dfabios comida rapida",
        image: "dfabios.jpg",
        url: "https://www.facebook.com/DFABIOS",
        alt: "Dfabios comida rapida"
    },
];

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
                            <img :src="`/imgs/${ls.image}`" :alt="ls.name" class="w-full rounded-lg">
                        </a>
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>
<script setup>
import { ref } from "vue";
import { ChevronRight } from "lucide-vue-next";

// Todos los paquetes abiertos por defecto; cada uno se puede plegar
const isOpen = ref(Array(5).fill(true));

const toggleAccordion = (index) => {
    isOpen.value[index] = !isOpen.value[index];
};

const parseDescription = (description) => {
    const lines = description.split("\n").map(line => line.trim());
    const mainDescription = lines.filter(line => !line.startsWith("-"));
    const subDescription = lines.filter(line => line.startsWith("-"));
    return { mainDescription, subDescription };
};

const items = [
    {
        title: "Paquete local",
        description: `Mistika Casa Club, ubicado en el Jr. La Estancia S/N, Urb. Santa María del Huallaga, proporcionará:
            - Mesas con manteles 
            - Sillas con lazos
            - Seguridad
            - Limpieza
            - Mozos
        `,
        hour: "",
    },
    {
        title: "Paquete de comida",
        description: "Consistirá de un plato gourmet en base a pollo + gaseosa inca kola de 600 mL",
        hour: "",
    },
    {
        title: "Paquete barra libre",
        description: `Incluye una selección de bebidas alcohólicas y no alcohólicas ilimitadas durante 3 horas
            - Bebidas alcohólicas: cócteles y licores.
            - Bebidas  no alcohólicas: gaseosas y refrescos.
            - Personal capacitado para servir las bebidas.
        `,
        hour: "",
    },
    {
        title: "Paquete orquesta",
        description: `Disfruta de la orquesta: Mirko Viera.
            - Actuación en vivo de la orquesta durante 5 horas.
            - Amplia variedad de repertorio musical: salsa, rock, baladas y más.
        `,
        hour: "",
    },
    {
        title: "Paquete banda",
        description: `Disfruta de la banda:
            - Actuación en vivo de la banda durante 1 hora.
            - Estilo musical variado.
        `,
        hour: "",
    },
].map((item) => ({
    ...item,
    parsedDescription: parseDescription(item.description),
}));
</script>

<template>
    <section id="paquetes" class="scroll-mt-24 py-16 sm:py-20">
        <div class="lg:grid lg:grid-cols-3 lg:gap-10">
            <div>
                <h2 class="text-2xl font-semibold sm:text-3xl">Paquetes</h2>
                <p class="mt-2 text-white/70">Lo que incluye el evento.</p>
            </div>

            <div class="glass-panel mt-6 divide-y divide-white/10 overflow-hidden lg:col-span-2 lg:mt-0">
                <div v-for="(item, index) in items" :key="index">
                    <button type="button" @click="toggleAccordion(index)"
                        class="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left text-lg font-semibold transition-colors hover:bg-white/5 sm:px-6"
                        :class="isOpen[index] ? 'bg-white/5' : ''"
                        :aria-expanded="isOpen[index]" :aria-controls="`paquete-${index}`">
                        <span>{{ item.title }}</span>

                        <span class="flex items-center gap-2 text-white/60">
                            <span v-if="item.hour" class="text-base font-medium">{{ item.hour }}</span>
                            <ChevronRight class="h-5 w-5 transition-transform duration-300"
                                :class="{ 'rotate-90': isOpen[index] }" aria-hidden="true" />
                        </span>
                    </button>
                    <div v-show="isOpen[index]" :id="`paquete-${index}`"
                        class="space-y-1 bg-white/5 px-5 pb-5 text-white/75 sm:px-6">
                        <p v-for="line in item.parsedDescription.mainDescription" :key="line">
                            {{ line }}
                        </p>
                        <ul v-if="item.parsedDescription.subDescription.length"
                            class="list-disc space-y-1 pl-5 pt-1 marker:text-flare">
                            <li v-for="line in item.parsedDescription.subDescription" :key="line">
                                {{ line.slice(1).trim() }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

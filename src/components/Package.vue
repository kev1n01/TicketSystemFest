<script setup>
import { ref } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

const isOpen = ref(Array(5).fill(false))

const toggleAccordion = (index) => {
    isOpen.value[index] = !isOpen.value[index]
}

const items = [
    {
        title: 'Paquete local',
        description: 
        `Mistika Casa Club, ubicado en el Jr. La Estancia S/N, Urb. Santa María del Huallaga, proporcionará:
            - Mesas con manteles 
            - Sillas con lazos
            - Seguridad
            - Limpieza
            - Mozos
        `,
        hour: ''
    },
    {
        title: 'Paquete de comida',
        description: 'Consistirá de un plato gourmet en base a pollo + gaseosa inca kola de 600 mL',
        hour: ''
    },
    {
        title: 'Paquete barra libre',
        description: 
        `Incluye una selección de bebidas alcohólicas y no alcohólicas ilimitadas durante 3 horas
            - Bebidas alcohólicas: cócteles y licores.
            - Bebidas  no alcohólicas: gaseosas y refrescos.
            - Personal capacitado para servir las bebidas.
        `,
        hour: ''
    },
    {
        title: 'Paquete orquesta',
        description: 
        `Disfruta de la orquesta: Mirko Viera.
            - Actuácion en vivo de la orquesta durante 5 horas.
            - Amplia variedad de repertorio musical: salsa, rock, baladas y más.
        `,
        hour: ''
    },
    {
        title: 'Paquete banda',
        description: 
        `Disfruta de la banda:
            - Actuácion en vivo de la banda durante 1 hora.
            - Estilo musical variado.
        `,
        hour: ''
    },
    {
        title: 'Paquete DJs',
        description: 
        `DJ HEN | DJ GALY
            - Actuácion en vivo de los DJs durante 3 horas.
            - Estilo musical variado.
        `,
        hour: ''
    },
    {
        title: 'Paquete Animador',
        description: 'Actuación en vivo del animador durante 3 horas.',
        hour: ''
    },
    {
        title: 'Paquete hora loca',
        description: 'Disfruta en vivo de la hora-loca durante 1 hora.',
        hour: ''
    },
]

</script>

<template>
    <section id="paquetes">
        <div class="py-20 xs:mx-2">
            <h1 class="text-center text-3xl font-semibold py-10">[ Paquetes ]</h1>
            <div class="space-y-4 max-w-4xl mx-auto">
                <template v-for="(item, index) in items" :key="index">
                    <div
                        class="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border-[1px] border-white/25 transform transition-transform duration-500 ease-in-out">
                        <div @click="toggleAccordion(index)"
                            :class="['p-4 font-bold text-xl cursor-pointer hover:bg-red-100/10 transition-colors flex justify-between text-start ', isOpen[index] ? 'bg-gradient-to-l from-black/70  to-red-900/60' : '']">

                            <div class="flex items-center gap-2">
                                <Check class="w-5" />
                                <p>
                                    {{ item.title }}
                                </p>
                            </div>
                            <div class="flex gap-2 items-center ">
                                {{ item.hour }}
                                <span class="transform transition-transform duration-400 ease-in-out"
                                    :class="{ 'rotate-180': isOpen[index] }">
                                    <ChevronDown />
                                </span>
                            </div>
                        </div>
                        <p v-show="isOpen[index]" class="p-4 text-gray-300 border-t border-red-900/30 whitespace-pre-line">
                            {{ item.description }}
                        </p>
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>
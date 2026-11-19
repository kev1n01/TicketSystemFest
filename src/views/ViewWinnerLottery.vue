<template>
    <DashLayout>
        <section class="glass-panel mt-2 w-full max-w-xl p-6 sm:mt-6 sm:p-8">
            <h1 class="text-2xl font-bold leading-tight">Ganadores del sorteo</h1>
            <p class="mt-1 text-sm text-white/65">Esta lista se actualiza sola durante el sorteo.</p>

            <ul v-if="winners.length > 0" class="mt-6 divide-y divide-white/10">
                <li v-for="winner in winners" :key="winner.id" class="flex items-center gap-4 py-4">
                    <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-flare/10 text-flare"
                        aria-hidden="true">
                        <Trophy class="h-5 w-5" />
                    </span>
                    <div class="min-w-0 flex-1">
                        <p class="break-words font-semibold">{{ winner.name }}</p>
                        <p v-if="winner.type === 'estudiante'" class="text-sm tabular-nums text-white/65">
                            Código: {{ winner.cod }}
                        </p>
                        <p v-else class="text-sm tabular-nums text-white/65">
                            DNI: {{ winner.dni ?? winner.cod }}
                        </p>
                    </div>
                    <span
                        class="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1 text-xs font-semibold text-white/85">
                        <span class="h-2 w-2 rounded-full" :class="winner.type === 'estudiante' ? 'bg-ember' : 'bg-flare'"
                            aria-hidden="true"></span>
                        {{ winner.type === 'estudiante' ? 'Estudiante' : 'Invitado' }}
                    </span>
                </li>
            </ul>

            <div v-else class="mt-6 rounded-2xl border border-dashed border-white/15 px-6 py-10 text-center">
                <Trophy class="mx-auto h-8 w-8 text-white/40" aria-hidden="true" />
                <p class="mt-3 font-semibold">Aún no hay ganadores.</p>
                <p class="mt-1 text-sm text-white/65">El sorteo se hace durante el evento.</p>
            </div>
        </section>
    </DashLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Trophy } from 'lucide-vue-next'
import { dataSource } from '../services/data'
import DashLayout from "../layout/DashLayout.vue";

const winners = ref([])
let unsubscribeWinners = null

onMounted(() => {
    // Listener en tiempo real
    unsubscribeWinners = dataSource.subscribeWinners((list) => {
        winners.value = list
    })
})

onUnmounted(() => {
    unsubscribeWinners?.()
})
</script>

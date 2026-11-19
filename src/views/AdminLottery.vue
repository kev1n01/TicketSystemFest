<template>
    <DashLayout>
        <div class="flex w-full max-w-xl flex-col items-center text-center">
            <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Sorteo</h1>
            <p class="mt-1.5 max-w-md text-sm text-white/65 sm:text-base">
                Cada sorteo elige un ganador al azar entre todos los estudiantes e invitados.
            </p>

            <button type="button" :class="['wheel', { 'spinning': isSpinning }]" class="mt-10" @click="startRaffle"
                :disabled="isSpinning" :aria-busy="isSpinning ? 'true' : 'false'">
                <span class="wheel-ring" aria-hidden="true"></span>
                <span class="relative flex flex-col items-center gap-3">
                    <Shuffle class="h-9 w-9 text-lilac" aria-hidden="true" />
                    <span class="text-lg font-semibold sm:text-xl">
                        {{ isSpinning ? 'Sorteando…' : 'Iniciar sorteo' }}
                    </span>
                </span>
            </button>

            <section class="glass-panel mt-12 w-full p-5 text-left sm:p-6" aria-labelledby="ganadores-titulo">
                <div class="flex items-baseline justify-between gap-3">
                    <h2 id="ganadores-titulo" class="text-xl font-semibold">Ganadores</h2>
                    <span v-if="winners.length > 0" class="text-sm tabular-nums text-white/60">
                        {{ winners.length }} en total
                    </span>
                </div>

                <div aria-live="polite">
                    <ul v-if="winners.length > 0" class="mt-3 divide-y divide-white/[0.06]">
                        <li v-for="winner in winners" :key="winner.id"
                            class="flex items-center justify-between gap-3 py-3">
                            <span class="min-w-0 break-words font-medium">{{ winner.name }}</span>
                            <span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1"
                                :class="winner.type === 'invitado'
                                    ? 'bg-flare/15 text-flare ring-flare/30'
                                    : 'bg-sky-400/15 text-sky-200 ring-sky-300/30'">
                                {{ winner.type }}
                            </span>
                        </li>
                    </ul>
                    <p v-else class="mt-3 text-white/65">
                        Todavía no hay ganadores. Inicia el sorteo para elegir el primero.
                    </p>
                </div>
            </section>
        </div>
    </DashLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { dataSource } from '../services/data'
import { Shuffle } from "lucide-vue-next";
import DashLayout from "../layout/DashLayout.vue";

const isSpinning = ref(false)
const winners = ref([])
const loading = ref(false)
const numberWinner = ref(1)
let unsubscribeWinners = null

const fetchWinners = () => {
    // Listener en tiempo real
    unsubscribeWinners = dataSource.subscribeWinners((list) => {
        winners.value = list
    })
}

const fetchParticipants = async () => {
    const [students, guests] = await Promise.all([
        dataSource.listParticipants('estudiantes'),
        dataSource.listParticipants('invitados')
    ])

    return [
        ...students.map((student) => ({ ...student, type: 'estudiante' })),
        ...guests.map((guest) => ({ ...guest, type: 'invitado' }))
    ]
}

const startRaffle = async () => {
    if (isSpinning.value) return

    isSpinning.value = true
    const participants = await fetchParticipants()

    // Número de ganadores (ajustable)

    // Selección aleatoria de ganadores
    const selectedWinners = []
    while (selectedWinners.length < 1 && participants.length > 0) {
        const winnerIndex = Math.floor(Math.random() * participants.length)
        const winner = participants.splice(winnerIndex, 1)[0]
        selectedWinners.push(winner)
    }

    // Guardar ganadores
    const winnersToSave = selectedWinners.map(async (winner) => {
        // Marcar como ganador en su colección original
        // const docRef = doc(db, winner.type + 's', winner.id)
        // await updateDoc(docRef, { isWinner: true })

        // Guardar en colección de winners
        return dataSource.addWinner({
            name: winner.nombres,
            cod: winner.cod || winner.dni,
            type: winner.type
        })
    })

    await Promise.all(winnersToSave)

    isSpinning.value = false
}

onMounted(() => {
    fetchWinners()
})

onUnmounted(() => {
    unsubscribeWinners?.()
})
</script>

<style scoped>
/* The raffle button: a dark glass disc with a lilac/flare light ring */
.wheel {
    position: relative;
    display: grid;
    place-items: center;
    width: 13rem;
    height: 13rem;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(16, 14, 11, 0.55);
    -webkit-backdrop-filter: blur(24px);
    backdrop-filter: blur(24px);
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 0 60px -12px rgba(142, 123, 227, 0.6),
        0 0 120px -24px rgba(248, 104, 196, 0.5);
    cursor: pointer;
    transition: box-shadow 0.3s ease, transform 0.15s ease;
}

.wheel:hover:not(:disabled) {
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        0 0 80px -10px rgba(142, 123, 227, 0.75),
        0 0 150px -20px rgba(248, 104, 196, 0.6);
}

.wheel:active:not(:disabled) {
    transform: scale(0.98);
}

.wheel:disabled {
    cursor: progress;
}

/* Faint track under the light ring */
.wheel::before {
    content: "";
    position: absolute;
    inset: 12px;
    border-radius: inherit;
    border: 3px solid rgba(255, 255, 255, 0.07);
}

/* Comet-shaped arc: transparent tail, lilac body, flare head */
.wheel-ring {
    position: absolute;
    inset: 12px;
    border-radius: inherit;
    background: conic-gradient(from 0deg,
            rgba(142, 123, 227, 0) 0deg,
            rgba(142, 123, 227, 0.2) 70deg,
            rgba(142, 123, 227, 0.9) 210deg,
            #f868c4 270deg,
            rgba(248, 104, 196, 0) 271deg);
    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
    mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
}

.wheel.spinning .wheel-ring {
    animation: spin 1.2s linear infinite;
}

@media (min-width: 640px) {
    .wheel {
        width: 15rem;
        height: 15rem;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>

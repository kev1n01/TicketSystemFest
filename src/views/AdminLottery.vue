<template>
    <DashLayout>
        <div class="w-full max-w-6xl">
            <header class="text-center lg:text-left">
                <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Sorteo</h1>
                <p class="mx-auto mt-1.5 max-w-md text-sm text-white/65 sm:text-base lg:mx-0">
                    Cada sorteo elige un ganador al azar entre todos los estudiantes e invitados.
                </p>
            </header>

            <div
                class="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] lg:items-start lg:gap-12">
                <div class="flex justify-center">
                    <RaffleWheel ref="wheel" :entries="wheelEntries" />
                </div>

                <div class="flex flex-col gap-6">
                    <!-- Control and result: the winner appears here when the wheel stops -->
                    <section class="glass-panel p-5 sm:p-6" aria-labelledby="resultado-titulo">
                        <h2 id="resultado-titulo" class="sr-only">Resultado del sorteo</h2>

                        <div aria-live="polite" aria-atomic="true">
                            <div v-if="currentWinner" :key="revealKey" class="reveal">
                                <p class="text-sm font-semibold text-white/70">Ganador del sorteo</p>
                                <p
                                    class="mt-2 break-words text-balance text-[clamp(2rem,7vw,3rem)] font-bold leading-[1.05] tracking-tight">
                                    {{ currentWinner.nombres }}
                                </p>
                                <span class="mt-4 inline-block rounded-full px-3 py-1 text-sm font-semibold ring-1"
                                    :class="currentWinner.type === 'invitado'
                                        ? 'bg-flare/15 text-flare ring-flare/30'
                                        : 'bg-sky-400/15 text-sky-200 ring-sky-300/30'">
                                    {{ currentWinner.type === 'invitado' ? 'Invitado' : 'Estudiante' }}
                                </span>
                            </div>
                            <p v-else-if="isSpinning" class="text-lg font-semibold">
                                La ruleta está girando. El ganador aparecerá aquí.
                            </p>
                            <p v-else-if="participantCount === 0" class="text-white/75">
                                Todavía no hay participantes registrados. Cuando se registren estudiantes o
                                invitados, podrás iniciar el sorteo.
                            </p>
                            <p v-else class="text-white/75">
                                El ganador aparecerá aquí cuando la ruleta se detenga.
                            </p>
                        </div>

                        <button type="button"
                            class="btn-primary mt-6 min-h-12 w-full bg-lilac text-lg text-night hover:bg-lilac/90"
                            :disabled="isSpinning" :aria-busy="isSpinning ? 'true' : 'false'" @click="startRaffle">
                            {{ startLabel }}
                        </button>

                        <p v-if="participantCount" class="mt-3 text-sm text-white/60">
                            {{ participantCount }}
                            {{ participantCount === 1 ? 'participante' : 'participantes' }} en el sorteo
                        </p>
                        <p v-if="isSampled" class="mt-1 text-sm text-white/60">
                            Se muestran {{ WHEEL_SLOTS }} participantes al azar en la ruleta; el ganador sale de
                            todos.
                        </p>
                        <p v-if="errorMessage" class="alert-error mt-4" role="alert">{{ errorMessage }}</p>
                    </section>

                    <section class="glass-panel w-full p-5 text-left sm:p-6" aria-labelledby="ganadores-titulo">
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
                                    <span
                                        class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1"
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
            </div>
        </div>
    </DashLayout>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { dataSource } from '../services/data'
import DashLayout from "../layout/DashLayout.vue";
import RaffleWheel from "../components/RaffleWheel.vue";

// The wheel stays readable up to this many names; bigger draws show a random sample that includes the winner
const WHEEL_SLOTS = 12

const isSpinning = ref(false)
const winners = ref([])
const wheel = ref(null)
const wheelPool = ref([]) // participants drawn on the wheel, in segment order
const participantCount = ref(null)
const currentWinner = ref(null)
const revealKey = ref(0)
const errorMessage = ref('')
let unsubscribeWinners = null

const isSampled = computed(() => participantCount.value > WHEEL_SLOTS)
const startLabel = computed(() => {
    if (isSpinning.value) return 'Sorteando…'
    return currentWinner.value ? 'Sortear de nuevo' : 'Iniciar sorteo'
})
const wheelEntries = computed(() => wheelPool.value.map((participant) => ({
    key: `${participant.type}-${participant.id}`,
    name: participant.nombres,
})))

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

const shuffle = (list) => {
    const result = [...list]
    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
}

// Everyone fits on the wheel up to WHEEL_SLOTS; past that, a random sample plus the winner
const buildWheelPool = (others, winner = null) => {
    const room = WHEEL_SLOTS - (winner ? 1 : 0)
    const shown = others.length > room ? shuffle(others).slice(0, room) : others
    return shuffle(winner ? [...shown, winner] : shown)
}

// Fill the idle wheel with names so the audience sees who is in the draw
const loadWheelPreview = async () => {
    try {
        const participants = await fetchParticipants()
        if (isSpinning.value) return
        participantCount.value = participants.length
        wheelPool.value = buildWheelPool(participants)
    } catch (error) {
        console.warn('No se pudo cargar la vista previa de la ruleta.', error)
    }
}

const startRaffle = async () => {
    if (isSpinning.value) return

    isSpinning.value = true
    errorMessage.value = ''
    currentWinner.value = null

    try {
        const participants = await fetchParticipants()
        participantCount.value = participants.length

        // Selección aleatoria de ganadores
        const selectedWinners = []
        while (selectedWinners.length < 1 && participants.length > 0) {
            const winnerIndex = Math.floor(Math.random() * participants.length)
            const winner = participants.splice(winnerIndex, 1)[0]
            selectedWinners.push(winner)
        }

        const [winner] = selectedWinners
        if (!winner) {
            wheelPool.value = []
            return
        }

        // The winner is already chosen; the wheel only shows it, landing on the winner's segment
        const pool = buildWheelPool(participants, winner)
        wheelPool.value = pool
        await nextTick()
        const landed = await wheel.value?.spinTo(pool.indexOf(winner))
        if (!landed) return

        currentWinner.value = winner
        revealKey.value += 1

        // Guardar en colección de winners
        try {
            await dataSource.addWinner({
                name: winner.nombres,
                cod: winner.cod || winner.dni,
                type: winner.type
            })
        } catch (error) {
            console.error(error)
            errorMessage.value = 'No se pudo guardar este ganador en la lista. Anota su nombre antes de sortear de nuevo.'
        }
    } catch (error) {
        console.error(error)
        errorMessage.value = 'No se pudo completar el sorteo. Revisa la conexión e inténtalo de nuevo.'
    } finally {
        isSpinning.value = false
    }
}

onMounted(() => {
    fetchWinners()
    loadWheelPreview()
})

onUnmounted(() => {
    unsubscribeWinners?.()
})
</script>

<style scoped>
.reveal {
    animation: reveal-in 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s both;
}

@keyframes reveal-in {
    from {
        opacity: 0;
        transform: translateY(10px) scale(0.97);
    }

    to {
        opacity: 1;
        transform: none;
    }
}
</style>

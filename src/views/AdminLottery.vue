<template>
    <DashLayout class="bg-gradient-to-t !from-black/80 !via-black/90 !to-blue-900">
        <div class="raffle-container">
            <div :class="['wheel', { 'spinning': isSpinning }]" @click="startRaffle">
                <div class="wheel-inner">
                    {{ isSpinning ? 'Sorteando' : 'Iniciar Sorteo' }}
                </div>
            </div>

            <div v-if="winners.length > 0" class="winners-section">
                <h2 class="text-center text-2xl font-semibold">Ganadores</h2>
                <div v-for="winner in winners" :key="winner.id" class="winner-item text-gray-900">
                    {{ winner.name }} ({{ winner.type }})
                </div>
            </div>
            <div v-else class="text-2xl text-center mt-10 text-wrap w-80">
                <p>No hay ganadores en este momento 🥺</p>
            </div>
        </div>
    </DashLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, query, where, getDocs, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import DashLayout from "../layout/DashLayout.vue";

const isSpinning = ref(false)
const winners = ref([])
const loading = ref(false)

const fetchWinners = async () => {
    const winnersRef = collection(db, 'winners')

    // Listener en tiempo real
    const unsubscribe = onSnapshot(winnersRef, (snapshot) => {
        winners.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    })
}

const fetchParticipants = async () => {
    const studentsQuery = query(
        collection(db, 'estudiantes')
    )
    const guestsQuery = query(
        collection(db, 'invitados')
    )

    const [studentsSnapshot, guestsSnapshot] = await Promise.all([
        getDocs(studentsQuery),
        getDocs(guestsQuery)
    ])

    const students = studentsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        type: 'estudiante'
    }))

    const guests = guestsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        type: 'invitado'
    }))

    return [...students, ...guests]
}

const startRaffle = async () => {
    if (isSpinning.value) return

    isSpinning.value = true
    const participants = await fetchParticipants()

    // Número de ganadores (ajustable)
    const numWinners = 3

    // Selección aleatoria de ganadores
    const selectedWinners = []
    while (selectedWinners.length < numWinners && participants.length > 0) {
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
        return addDoc(collection(db, 'winners'), {
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
</script>

<style scoped>
.raffle-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.wheel {
    width: 300px;
    height: 300px;
    background-color: #4CAF50;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: transform 3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.wheel.spinning {
    animation: spin 3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.wheel-inner {
    color: white;
    font-size: 24px;
    text-align: center;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(720deg);
    }
}

.winners-section {
    margin-top: 20px;
    text-align: center;
}

.winner-item {
    margin: 10px 0;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
}
</style>
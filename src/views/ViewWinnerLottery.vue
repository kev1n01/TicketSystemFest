<template>
    <DashLayout>
        <div class="winners-list" v-if="winners.length > 0">
            <h1 class="text-center text-2xl font-semibold">Ganadores del Sorteo</h1>
            <div v-for="winner in winners" :key="winner.id" class="winner-card">
                <h3>{{ winner.name }}</h3>
                <p v-if="winner.type === 'estudiante'">
                    Código: {{ winner.cod }}
                </p>
                <p v-else>
                    DNI: {{ winner.dni }}
                </p>
                <p>Tipo: {{ winner.type }}</p>
            </div>
        </div>
        <div v-else class="text-2xl text-center">
            <p>No hay ganadores en este momento 🥺</p>
        </div>
    </DashLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import DashLayout from "../layout/DashLayout.vue";

const winners = ref([])

onMounted(() => {
    const winnersRef = collection(db, 'winners')

    // Listener en tiempo real
    const unsubscribe = onSnapshot(winnersRef, (snapshot) => {
        winners.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    })
})
</script>

<style scoped>
.winners-list {
    max-width: 600px;
    margin: 0 auto;
}

.winner-card {
    background-color: #f4f4f4;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: black;
}
</style>
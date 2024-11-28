<script setup>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import DashLayout from "../layout/DashLayout.vue";

// Referencia a la colección de Firestore
const estudiantesRef = collection(db, "estudiantes");

// Estados reactivos
const estudiantes = ref([]);
const estudiantesFiltrados = ref([]);
const filtroCod = ref(""); // Filtro por código
const cargando = ref(true); // Estado de carga

// Función para formatear fecha
const formatearFecha = (timestamp) => {
    if (!timestamp) return "Sin registro";
    const fecha = timestamp.toDate();
    return new Intl.DateTimeFormat("es-ES", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(fecha);
};

// Función para obtener estudiantes con status "registrado"
const obtenerEstudiantesEgresados = async () => {
    try {
        const q = query(estudiantesRef, where("status", "==", "registrado"));
        const querySnapshot = await getDocs(q);

        estudiantes.value = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Inicialmente, los estudiantes filtrados son todos
        estudiantesFiltrados.value = [...estudiantes.value];
    } catch (error) {
        console.error("Error al obtener estudiantes:", error);
    } finally {
        cargando.value = false; // Oculta el skeleton cuando se terminan de cargar los datos
    }
};

// Función para filtrar estudiantes por código
const filtrarEstudiantes = () => {
    const filtro = filtroCod.value.toLowerCase();
    estudiantesFiltrados.value = estudiantes.value.filter((estudiante) =>
        estudiante.cod.toLowerCase().includes(filtro)
    );
};

// Llamar a la función al montar el componente
onMounted(() => {
    obtenerEstudiantesEgresados();
});
</script>

<template>
    <DashLayout class="bg-gradient-to-t !from-black/80 !via-black/90 !to-blue-900">
        <div class="p-4 w-full relative rounded-lg bg-white text-gray-800">
            <h1 class="text-2xl font-bold mb-4 text-center">
                Lista de Estudiantes Egresados
            </h1>

            <!-- Campo de búsqueda -->
            <div class="mb-4 flex justify-start">
                <input v-model="filtroCod" @input="filtrarEstudiantes" type="text" placeholder="Buscar por Código"
                    class="px-4 py-2 border border-gray-500 rounded-md xs:w-4/5 md:w-1/2" :disabled="cargando" />
            </div>

            <!-- Skeleton mientras carga -->
            <div v-if="cargando" class="space-y-2">
                <div v-for="n in 4" :key="n" class="animate-pulse bg-gray-200 h-10 w-full rounded-md"></div>
            </div>

            <!-- Tabla responsiva -->
            <div v-else class="overflow-x-auto">
                <table class="min-w-full border-collapse border border-gray-300 rounded-xl">
                    <thead>
                        <tr class="bg-gray-200 rounded-xl">
                            <th class="border border-gray-300 px-4 py-2">Cod</th>
                            <th class="border border-gray-300 px-4 py-2">Nombre</th>
                            <th class="border border-gray-300 px-4 py-2">Estado</th>
                            <th class="border border-gray-300 px-4 py-2">
                                Fecha y Hora de Registro
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="estudiante in estudiantesFiltrados" :key="estudiante.id" class="hover:bg-gray-100">
                            <td class="border border-gray-300 px-4 py-2">{{ estudiante.cod }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ estudiante.nombres }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ estudiante.status }}</td>
                            <td class="border border-gray-300 px-4 py-2">
                                {{ formatearFecha(estudiante.timestamp) }}
                            </td>
                        </tr>
                        <tr v-if="estudiantesFiltrados.length === 0">
                            <td colspan="4" class="text-center text-gray-500 border border-gray-300 px-4 py-2">
                                No se encontraron resultados
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </DashLayout>
</template>

<style></style>

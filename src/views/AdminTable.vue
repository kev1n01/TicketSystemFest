<script setup>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import DashLayout from "../layout/DashLayout.vue";

// Referencia a las colecciones de Firestore
const estudiantesRef = collection(db, "estudiantes");
const invitadosRef = collection(db, "invitados");

// Estados reactivos
const participantes = ref([]);          // Todos los estudiantes e invitados combinados
const participantesFiltrados = ref([]); // Participantes filtrados
const filtroCodDni = ref("");           // Filtro por código o DNI
const cargando = ref(true);             // Estado de carga
const estudiantesCantidad = ref([]);
const invitadosCantidad = ref([]);

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
        const q = query(estudiantesRef);
        const querySnapshot = await getDocs(q);

        const estudiantes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            tipo: "estudiante",
            ...doc.data(),
        }));

        return estudiantes;
    } catch (error) {
        console.error("Error al obtener estudiantes:", error);
        return [];
    }
};

// Función para obtener invitados con status "registrado"
const obtenerInvitadosEgresados = async () => {
    try {
        const q = query(invitadosRef);
        const querySnapshot = await getDocs(q);

        const invitados = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            tipo: "invitado",
            ...doc.data(),
        }));

        return invitados;
    } catch (error) {
        console.error("Error al obtener invitados:", error);
        return [];
    }
};

// Función para combinar estudiantes e invitados y filtrarlos por código o DNI
const combinarYFiltrarParticipantes = () => {
    const filtro = filtroCodDni.value.toLowerCase();

    // Filtrar los estudiantes y los invitados por su código o DNI
    participantesFiltrados.value = participantes.value.filter((participante) =>
        participante.tipo === "estudiante"
            ? participante.cod.toLowerCase().includes(filtro)
            : participante.dni.toLowerCase().includes(filtro)
    );
};

// Llamar a la función al montar el componente
onMounted(async () => {
    const estudiantes = await obtenerEstudiantesEgresados();
    const invitados = await obtenerInvitadosEgresados();

    estudiantesCantidad.value = [...estudiantes];
    invitadosCantidad.value = [...invitados];

    // Unir los estudiantes e invitados en una sola lista
    participantes.value = [...estudiantes, ...invitados];

    // Inicialmente, los participantes filtrados son todos
    participantesFiltrados.value = [...participantes.value];

    cargando.value = false; // Oculta el skeleton cuando se terminan de cargar los datos
});
</script>

<template>
    <DashLayout class="bg-gradient-to-t !from-black/80 !via-black/90 !to-blue-900">
        <div class="p-4 w-full relative rounded-lg bg-white text-gray-800">
            <h1 class="xs:text-lg sm:text-2xl font-bold mb-4 text-center">
                {{ estudiantesCantidad.length }} Estudiantes / {{ invitadosCantidad.length }} Invitado{{
                    invitadosCantidad.length > 1 ? 's' : '' }}
                Registrados
            </h1>



            <!-- Skeleton mientras carga -->
            <div v-if="cargando" class="space-y-2">
                <div class="animate-pulse bg-gray-200 h-10 w-2/4 rounded-md"></div>
                <div class="animate-pulse bg-gray-200 h-40 w-full rounded-md"></div>
            </div>

            <!-- Tabla responsiva -->
            <div v-else>
                <!-- Campo de búsqueda -->
                <div class="mb-4 flex justify-start">
                    <input v-model="filtroCodDni" @input="combinarYFiltrarParticipantes" type="text"
                        placeholder="Buscar por Código o DNI"
                        class="px-4 py-2 border border-gray-500 rounded-md xs:w-4/5 md:w-1/2" :disabled="cargando" />
                </div>
                <div class="overflow-x-auto overflow-y-auto max-h-96 min-h-40">
                    <table class="min-w-full border-collapse border border-gray-300 rounded-xl">
                        <thead>
                            <tr class="bg-gray-200 rounded-xl">
                                <th class="border border-gray-300 px-4 py-2">Código / DNI</th>
                                <th class="border border-gray-300 px-4 py-2">Nombre</th>
                                <th class="border border-gray-300 px-4 py-2">Estado</th>
                                <th class="border border-gray-300 px-4 py-2">Fecha y Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="participante in participantesFiltrados" :key="participante.id"
                                class="hover:bg-gray-100 font-medium">
                                <td class="border border-gray-300 px-4 py-2">
                                    {{ participante.tipo === 'estudiante' ? participante.cod : participante.dni }}
                                </td>
                                <td class="border border-gray-300 px-4 py-2">{{ participante.nombres }} /
                                    <span class="font-bold">
                                        {{ participante.tipo === 'estudiante' ? 'Estudiante' : 'Invitado' }}
                                    </span>
                                </td>
                                <td class="border border-gray-300 px-4 py-2 text-sm">
                                    <span class="bg-green-500 text-white rounded-md px-2 py-1"
                                        v-if="participante.status === 'registrado'">
                                        {{ participante.status }}
                                    </span>
                                    <span class="bg-red-500/80 text-white rounded-md px-2 py-1" v-else>
                                        {{ participante.status ? participante.status : 'no_registrado' }}
                                    </span>
                                </td>
                                <td class="border border-gray-300 px-4 py-2">
                                    {{ formatearFecha(participante.timestamp) }}
                                </td>
                            </tr>
                            <tr v-if="participantesFiltrados.length === 0">
                                <td colspan="4" class="text-center text-gray-500 border border-gray-300 px-4 py-2 h-40">
                                    No se encontraron resultados
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </DashLayout>
</template>

<style></style>

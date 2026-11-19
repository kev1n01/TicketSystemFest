<script setup>
import { ref, onMounted } from "vue";
import { dataSource } from "../services/data";
import { Search } from "lucide-vue-next";
import DashLayout from "../layout/DashLayout.vue";

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
    return new Intl.DateTimeFormat("es-ES", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(timestamp);
};

// Función para obtener estudiantes con status "registrado"
const obtenerEstudiantesEgresados = async () => {
    try {
        const estudiantes = (await dataSource.listParticipants("estudiantes")).map((participante) => ({
            tipo: "estudiante",
            ...participante,
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
        const invitados = (await dataSource.listParticipants("invitados")).map((participante) => ({
            tipo: "invitado",
            ...participante,
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
    <DashLayout>
        <section class="glass-panel w-full max-w-5xl p-4 sm:p-6">
            <header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Historial de ingresos</h1>
                    <p class="mt-1.5 text-sm text-white/65 sm:text-base">
                        Revisa quién ya ingresó al fest y a qué hora.
                    </p>
                </div>

                <dl class="grid grid-cols-3 gap-2 sm:gap-3 lg:w-[26rem]">
                    <div class="rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-3 text-center sm:px-4 sm:text-left">
                        <dt class="text-xs text-white/60 sm:text-sm">Estudiantes</dt>
                        <dd class="mt-0.5 text-xl font-semibold tabular-nums sm:text-2xl">
                            {{ cargando ? '–' : estudiantesCantidad.length }}
                        </dd>
                    </div>
                    <div class="rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-3 text-center sm:px-4 sm:text-left">
                        <dt class="text-xs text-white/60 sm:text-sm">Invitados</dt>
                        <dd class="mt-0.5 text-xl font-semibold tabular-nums sm:text-2xl">
                            {{ cargando ? '–' : invitadosCantidad.length }}
                        </dd>
                    </div>
                    <div class="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.07] px-2 py-3 text-center sm:px-4 sm:text-left">
                        <dt class="text-xs text-emerald-100/75 sm:text-sm">Ingresaron</dt>
                        <dd class="mt-0.5 text-xl font-semibold tabular-nums text-emerald-200 sm:text-2xl">
                            {{ cargando ? '–' : participantes.filter((p) => p.status === 'registrado').length }}
                        </dd>
                    </div>
                </dl>
            </header>

            <!-- Skeleton mientras carga -->
            <div v-if="cargando" class="mt-6 animate-pulse space-y-3" aria-hidden="true">
                <div class="h-12 w-full rounded-xl bg-white/10 sm:w-80"></div>
                <div class="h-64 w-full rounded-2xl bg-white/10"></div>
            </div>

            <!-- Tabla responsiva -->
            <div v-else class="mt-6">
                <!-- Campo de búsqueda -->
                <label for="buscar-participante" class="field-label">Buscar por código o DNI</label>
                <div class="relative w-full sm:max-w-sm">
                    <Search class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45"
                        aria-hidden="true" />
                    <input id="buscar-participante" v-model="filtroCodDni" @input="combinarYFiltrarParticipantes"
                        type="text" placeholder="Escribe un código o DNI" class="field-input pl-12"
                        autocomplete="off" spellcheck="false" :disabled="cargando" />
                </div>

                <div class="mt-4 max-h-[28rem] min-h-40 overflow-auto rounded-2xl border border-white/10">
                    <table class="w-full min-w-[40rem] border-collapse text-left">
                        <thead>
                            <tr>
                                <th scope="col"
                                    class="sticky top-0 z-10 whitespace-nowrap bg-ink/95 px-4 py-3 text-sm font-medium text-white/60 backdrop-blur">
                                    Código / DNI</th>
                                <th scope="col"
                                    class="sticky top-0 z-10 whitespace-nowrap bg-ink/95 px-4 py-3 text-sm font-medium text-white/60 backdrop-blur">
                                    Nombre</th>
                                <th scope="col"
                                    class="sticky top-0 z-10 whitespace-nowrap bg-ink/95 px-4 py-3 text-sm font-medium text-white/60 backdrop-blur">
                                    Estado</th>
                                <th scope="col"
                                    class="sticky top-0 z-10 whitespace-nowrap bg-ink/95 px-4 py-3 text-sm font-medium text-white/60 backdrop-blur">
                                    Fecha y hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="participante in participantesFiltrados" :key="participante.id"
                                class="border-t border-white/[0.06] hover:bg-white/[0.04]">
                                <td class="whitespace-nowrap px-4 py-3 font-medium tabular-nums">
                                    {{ participante.tipo === 'estudiante' ? participante.cod : participante.dni }}
                                </td>
                                <td class="px-4 py-3">
                                    <span class="block font-medium">{{ participante.nombres }}</span>
                                    <span class="mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1"
                                        :class="participante.tipo === 'estudiante'
                                            ? 'bg-sky-400/15 text-sky-200 ring-sky-300/30'
                                            : 'bg-flare/15 text-flare ring-flare/30'">
                                        {{ participante.tipo === 'estudiante' ? 'Estudiante' : 'Invitado' }}
                                    </span>
                                </td>
                                <td class="whitespace-nowrap px-4 py-3">
                                    <span v-if="participante.status === 'registrado'"
                                        class="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-400/30">
                                        <span class="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true"></span>
                                        Ingresó
                                    </span>
                                    <span v-else
                                        class="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-sm font-semibold text-white/60 ring-1 ring-white/15">
                                        <span class="h-1.5 w-1.5 rounded-full bg-white/40" aria-hidden="true"></span>
                                        Pendiente
                                    </span>
                                </td>
                                <td class="whitespace-nowrap px-4 py-3 tabular-nums text-white/70">
                                    {{ formatearFecha(participante.timestamp) }}
                                </td>
                            </tr>
                            <tr v-if="participantesFiltrados.length === 0">
                                <td colspan="4" class="h-40 px-4 py-6 text-center text-white/60">
                                    {{ filtroCodDni
                                        ? 'Ningún participante coincide con ese código o DNI. Revisa el número e intenta de nuevo.'
                                        : 'Todavía no hay participantes cargados.' }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </DashLayout>
</template>

<template>
    <DashLayout>
        <section class="glass-panel w-full max-w-2xl p-5 sm:p-8">
            <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Cargar participantes</h1>
            <p class="mt-1.5 max-w-prose text-sm text-white/65 sm:text-base">
                Sube un Excel por tipo de participante. Se lee la primera hoja: la fila 1 es el encabezado,
                la columna B el nombre y la columna C el DNI o el código.
            </p>

            <!-- Zonas para cargar archivos: el input cubre la zona, así se puede hacer clic o soltar el archivo -->
            <div class="mt-6 grid gap-4 sm:grid-cols-2">
                <label class="relative block">
                    <input type="file" @change="handleFileChange($event, 'invitados')" accept=".xlsx, .xls"
                        aria-label="Cargar invitados (archivo .xlsx o .xls)"
                        class="peer absolute inset-0 z-10 h-full w-full cursor-pointer text-base opacity-0" />
                    <span
                        class="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-5 text-center transition-colors peer-hover:border-lilac/60 peer-hover:bg-lilac/[0.06] peer-focus-visible:border-lilac peer-focus-visible:ring-2 peer-focus-visible:ring-lilac/40">
                        <FileSpreadsheet class="h-8 w-8 text-lilac" aria-hidden="true" />
                        <span class="text-lg font-semibold">Invitados</span>
                        <span class="text-sm text-white/60">Haz clic o suelta aquí un archivo .xlsx o .xls</span>
                    </span>
                </label>

                <label class="relative block">
                    <input type="file" @change="handleFileChange($event, 'estudiantes')" accept=".xlsx, .xls"
                        aria-label="Cargar estudiantes (archivo .xlsx o .xls)"
                        class="peer absolute inset-0 z-10 h-full w-full cursor-pointer text-base opacity-0" />
                    <span
                        class="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-5 text-center transition-colors peer-hover:border-lilac/60 peer-hover:bg-lilac/[0.06] peer-focus-visible:border-lilac peer-focus-visible:ring-2 peer-focus-visible:ring-lilac/40">
                        <FileSpreadsheet class="h-8 w-8 text-lilac" aria-hidden="true" />
                        <span class="text-lg font-semibold">Estudiantes</span>
                        <span class="text-sm text-white/60">Haz clic o suelta aquí un archivo .xlsx o .xls</span>
                    </span>
                </label>
            </div>

            <!-- Mensajes de estado -->
            <div class="mt-5 space-y-3 empty:hidden" aria-live="polite">
                <div v-if="loading"
                    class="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-medium">
                    <LoaderCircle class="h-5 w-5 shrink-0 animate-spin text-lilac" aria-hidden="true" />
                    <span>Subiendo datos…</span>
                </div>
            </div>
        </section>
    </DashLayout>
</template>

<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import { dataSource } from '../services/data'
import { LoaderCircle, FileSpreadsheet } from "lucide-vue-next";
import DashLayout from "../layout/DashLayout.vue";
import { toast } from "../composables/useToast";

const loading = ref(false)
const count = ref(0)

// Función para leer el archivo Excel
const handleFileChange = (event, type) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = async (e) => {
        try {
            // Lee el archivo Excel
            const workbook = XLSX.read(e.target.result, { type: 'binary' })
            const sheetName = workbook.SheetNames[0] // Suponiendo que solo hay una hoja
            const sheet = workbook.Sheets[sheetName]

            // Convierte la hoja a un array de objetos
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })

            // El primer índice es el encabezado, lo eliminamos
            const headers = data.shift()

            // Filtra y mapea los datos según el tipo de archivo
            const formattedData = data.map(row => {
                if (type === 'invitados') {
                    return {
                        nombres: row[1],  // Asume que la segunda columna es el nombre
                        dni: row[2],   // Asume que la primera columna es el DNI
                    }
                } else if (type === 'estudiantes') {
                    return {
                        nombres: row[1],  // Asume que la segunda columna es el nombre
                        cod: row[2],   // Asume que la primera columna es el código
                    }
                }
            })

            // Guardar los datos en la fuente de datos (Firestore o demo)
            await saveParticipants(formattedData, type)
        } catch (error) {
            console.error("Error al procesar el archivo:", error)
            toast.error("Hubo un error al procesar el archivo.")
        }
    }

    // Lee el archivo como binario
    reader.readAsBinaryString(file)
}

// Función para guardar los participantes
const saveParticipants = async (data, type) => {
    loading.value = true
    try {
        const collectionName = type === 'invitados' ? 'invitados' : 'estudiantes'

        // Guardar cada documento
        for (const item of data) {
            await dataSource.addParticipant(collectionName, item)
            count.value = count.value + 1
        }

        toast.success(`${count.value} registros de ${type} subidos exitosamente.`, { title: "Datos cargados" })
    } catch (error) {
        console.error("Error al guardar los datos:", error)
        toast.error("Hubo un error al guardar los datos.")
    } finally {
        loading.value = false
    }
}
</script>

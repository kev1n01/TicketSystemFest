<template>
    <DashLayout class="bg-gradient-to-t !from-black/80 !via-black/90 !to-blue-900">
        <div class="upload-container text-black">

            <!-- Botones para cargar archivos -->
            <h3 class="text-xl">Cargar invitados</h3>
            <input type="file" @change="handleFileChange($event, 'invitados')" accept=".xlsx, .xls" />

            <h3 class="text-xl">Cargar estudiantes</h3>
            <input type="file" @change="handleFileChange($event, 'estudiantes')" accept=".xlsx, .xls" />

            <!-- Mensajes de estado -->

            <div v-if="loading" class=" text-center flex flex-col  items-center content-center">
                <LoaderCircle class="animate-spin mr-2 text-center w-10 h-10 text-blue-700/80" />
                <span>Subiendo datos...</span>
            </div>

            <p v-if="statusMessage"
                class="w-80 text-base mb-4 font-semibold text-center p-2 bg-gray-500/20 border border-gray-400 rounded-md">
                {{ statusMessage }}</p>
        </div>
    </DashLayout>
</template>

<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import { db } from '../firebase' // Asegúrate de que esto esté configurado correctamente
import { collection, addDoc } from 'firebase/firestore'
import { LoaderCircle } from "lucide-vue-next";
import DashLayout from "../layout/DashLayout.vue";

const statusMessage = ref("")
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

            // Guardar los datos en Firestore
            await saveToFirestore(formattedData, type)
        } catch (error) {
            console.error("Error al procesar el archivo:", error)
            statusMessage.value = "Hubo un error al procesar el archivo. ❌"
        }
    }

    // Lee el archivo como binario
    reader.readAsBinaryString(file)
}

// Función para guardar los datos en Firestore
const saveToFirestore = async (data, type) => {
    loading.value = true
    try {
        // Referencia a la colección adecuada en Firestore
        const collectionName = type === 'invitados' ? 'invitados' : 'estudiantes'
        const collectionRef = collection(db, collectionName)

        // Guardar cada documento en Firestore
        for (const item of data) {
            await addDoc(collectionRef, item)
            count.value = count.value + 1
        }
        
        statusMessage.value = `${count.value} registros de ${type} subidos exitosamente. ✅`
    } catch (error) {
        console.error("Error al guardar en Firestore:", error)
        statusMessage.value = "Hubo un error al guardar los datos. ❌"
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f4f4f4;
    border-radius: 8px;
}

input[type="file"] {
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    background-color: #fff;

}

p {
    margin-top: 10px;
}
</style>
<template>
    <main class="flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6">
        <div class="w-full max-w-md">
            <!-- Logos on white tiles so they stay legible over the aura -->
            <div class="mb-6 flex items-center justify-center gap-3">
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 sm:h-16 sm:w-16">
                    <img src="/imgs/ltd-compress.webp" alt="Logo de LTD UDH" class="max-h-full w-auto object-contain">
                </div>
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 sm:h-16 sm:w-16">
                    <img src="/imgs/paisi-compress.webp" alt="Logo de PAISI" class="max-h-full w-auto object-contain">
                </div>
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 sm:h-16 sm:w-16">
                    <img src="/icon.png" alt="Logo de System Fest" class="max-h-full w-auto object-contain">
                </div>
            </div>

            <form @submit.prevent="handleSubmit" class="glass-panel p-6 sm:p-8">
                <TicketTypeTabs />
                <h1 class="text-2xl font-bold leading-tight">Genera tu ticket de invitado</h1>
                <p class="mt-2 text-white/70">
                    Con tu DNI obtienes el QR que mostrarás en la entrada.
                </p>

                <div class="mt-6 space-y-5">
                    <p v-if="messageValidateError !== ''" class="alert-error" role="alert">
                        {{ messageValidateError }}
                    </p>
                    <p v-if="messageValidateSuccess !== ''" class="alert-success" role="status">
                        {{ messageValidateSuccess }}
                    </p>

                    <div>
                        <label for="dni" class="field-label">DNI</label>
                        <input v-model="formData.dni" type="text" id="dni" autofocus placeholder="Ingresa tu DNI"
                            class="field-input" required max="8" min="8" maxlength="8" />
                    </div>

                    <button type="submit" :disabled="loading" class="btn-primary w-full">
                        <LoaderCircle v-if="loading" class="h-5 w-5 animate-spin" aria-hidden="true" />
                        <span>{{ loading ? "Generando…" : "Generar ticket" }}</span>
                    </button>
                </div>
            </form>

            <div class="mt-4 flex justify-center">
                <router-link to="/home"
                    class="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3 text-sm font-medium text-white/70 transition-colors hover:text-white">
                    <ArrowLeft class="h-4 w-4" aria-hidden="true" />
                    Volver al inicio
                </router-link>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { LoaderCircle, ArrowLeft } from "lucide-vue-next";
import TicketTypeTabs from "../components/TicketTypeTabs.vue";

const router = useRouter();
const userStore = useUserStore();
const messageValidateError = ref("");
const messageValidateSuccess = ref("");

const formData = ref({
    dni: "",
});

const loading = ref(false);

const handleSubmit = async () => {
    try {
        loading.value = true;
        messageValidateError.value = "";
        messageValidateSuccess.value = "";

        if (!formData.value.dni) {
            messageValidateError.value = "Este campo es obligatorio.";
            return;
        }

        // actualizando estado del participante
        const result = await userStore.updateParticipantGuessStatus(formData.value.dni);

        if (!result.success) {
            messageValidateError.value = result.message;
            return;
        }

        if (result.success) {
            messageValidateSuccess.value = result.message;

            setTimeout(() => {
                router.push("/view-ticket-guess");
            }, 2000);
        }
    } catch (error) {
        messageValidateError.value = "Ocurrió un error al generar el ticket, inténtelo más tarde.";
    } finally {
        loading.value = false;
    }
};

</script>

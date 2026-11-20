<script setup>
import { Check, Circle, LoaderCircle, X } from "lucide-vue-next";

defineProps({
    // [{ label, state: "pending" | "active" | "done" | "error" }]
    steps: { type: Array, required: true },
    visible: { type: Boolean, default: false },
});

const labelClass = {
    pending: "text-white/40",
    active: "font-medium text-white",
    done: "text-white/75",
    error: "font-medium text-red-200",
};
</script>

<template>
    <!-- Expands smoothly: animating grid rows from 0fr to 1fr avoids measuring the height -->
    <div class="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
        :class="visible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'" :aria-hidden="!visible">
        <div class="overflow-hidden">
            <ol class="space-y-2.5 pt-5" aria-label="Progreso de la búsqueda">
                <li v-for="step in steps" :key="step.label" class="flex items-center gap-3 text-sm transition-colors duration-300"
                    :class="labelClass[step.state]">
                    <span class="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden="true">
                        <LoaderCircle v-if="step.state === 'active'" class="h-5 w-5 animate-spin" />
                        <Check v-else-if="step.state === 'done'" class="step-pop h-5 w-5 text-emerald-300" />
                        <X v-else-if="step.state === 'error'" class="step-pop h-5 w-5 text-ember" />
                        <Circle v-else class="h-3.5 w-3.5" />
                    </span>
                    <span>{{ step.label }}<span v-if="step.state === 'active'">…</span></span>
                    <span class="sr-only">
                        {{ { pending: "pendiente", active: "en curso", done: "listo", error: "falló" }[step.state] }}
                    </span>
                </li>
            </ol>
        </div>
    </div>
</template>

<style scoped>
.step-pop {
    animation: step-pop 320ms cubic-bezier(0.21, 1.02, 0.73, 1);
}

@keyframes step-pop {
    from {
        opacity: 0;
        transform: scale(0.5);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>

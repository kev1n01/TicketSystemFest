<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { ArrowUp } from "lucide-vue-next";

const isVisible = ref(false);

const checkScroll = () => {
    isVisible.value = window.scrollY > 0;
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

onMounted(() => {
    window.addEventListener("scroll", checkScroll);
});

onUnmounted(() => {
    window.removeEventListener("scroll", checkScroll);
});
</script>

<template>
    <div>
        <button v-if="isVisible" type="button" @click="scrollToTop" aria-label="Volver arriba"
            class="fixed bottom-4 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-night/70 text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-colors hover:border-ember hover:bg-ember sm:bottom-8 sm:right-8">
            <ArrowUp class="h-5 w-5" aria-hidden="true" />
        </button>
    </div>
</template>

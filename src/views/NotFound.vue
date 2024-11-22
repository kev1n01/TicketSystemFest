<template>
    <div class="flex justify-center items-center bg-black/90 min-h-screen text-white font-epilogue">
        <div class="text-center">
            <h1 class="mb-3 font-dastress">404 🥺</h1>
            <h2 class="mb-3 font-medium">Página No Encontrada</h2>
            <p class="mb-7 text-white/80 xs:text-wrap w-80">
                Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
            <router-link to="/" class="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded font-semibold text-lg">
                Volver 
            </router-link>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
h1 {
    font-size: 6rem;
    color: var(--primary-color);
    font-weight: bold;
}

h2 {
    font-size: 2rem;
    color: var(--text-color);
}

p {
    font-size: 1.1rem;
}
</style>
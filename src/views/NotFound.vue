<template>
    <div class="container">
        <div class="not-found-container text-center">
            <h1 class="mb-4">404</h1>
            <h2 class="mb-3">Página No Encontrada</h2>
            <p class="mb-4">
                Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
            <router-link to="/" class="btn btn-primary">
                Volver al Inicio
            </router-link>
        </div>
    </div>
</template>

<script setup>
// No se necesita lógica adicional para esta vista
</script>

<style scoped>
.not-found-container {
    padding: 4rem 1rem;
    max-width: 600px;
    margin: 0 auto;
}

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
    color: #666;
    font-size: 1.1rem;
}
</style>
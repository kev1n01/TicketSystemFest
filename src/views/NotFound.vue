<template>
    <main class="flex min-h-screen items-center justify-center px-4 py-10">
        <section class="glass-panel w-full max-w-md p-8 text-center sm:p-10">
            <p class="font-dastress text-[7rem] leading-none text-ember sm:text-[8.5rem]">404</p>
            <h1 class="mt-4 text-2xl font-bold leading-tight">Página no encontrada</h1>
            <p class="mx-auto mt-2 max-w-xs text-white/70">
                El enlace puede estar mal escrito o la página ya no existe. Desde el inicio puedes generar o ver tu
                ticket.
            </p>
            <router-link to="/home" class="btn-primary mt-8 w-full sm:w-auto">
                Ir al inicio
            </router-link>
        </section>
    </main>
</template>

<script setup>
</script>

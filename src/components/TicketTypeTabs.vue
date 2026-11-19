<script setup>
// Tabs to choose how to sign in for a ticket. Each tab is its own route, so links stay shareable.
const tabs = [
  { to: "/generate-ticket", label: "Estudiante" },
  { to: "/generate-ticket-guess", label: "Invitado" },
];
</script>

<template>
  <nav aria-label="Tipo de ticket" class="-mx-2 mb-6 grid grid-cols-2 border-b border-white/10">
    <RouterLink v-for="tab in tabs" :key="tab.to" :to="tab.to" exact-active-class="nav-active"
      class="tab-link text-white/65 hover:text-white">
      {{ tab.label }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.tab-link {
  @apply flex min-h-12 items-center justify-center text-base font-semibold transition-colors;
}
</style>

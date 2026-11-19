<script setup>
defineProps({
  label: {
    type: String,
    default: "Button",
  },
  type: {
    type: String,
    default: "button",
  },
  link: {
    type: String,
    default: null,
  },
});
</script>

<template>
  <div>
    <a :href="link" class="btn-primary flex min-h-11 w-full py-2.5 text-center">
      {{ label }}
    </a>
  </div>
</template>

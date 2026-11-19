<script setup>
// Call-to-action link with a light that keeps travelling around its border and a glossy inner highlight.
// Original implementation of the "shimmer button" idea; motion stops under prefers-reduced-motion.
defineProps({
  to: { type: String, required: true },
});
</script>

<template>
  <RouterLink :to="to" class="shimmer-button">
    <span class="shimmer-button__label">
      <slot />
    </span>
  </RouterLink>
</template>

<style scoped>
.shimmer-button {
  --shimmer-speed: 3.2s;
  --ring: 2px;
  position: relative;
  isolation: isolate;
  display: inline-flex;
  min-height: 4rem;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9999px;
  padding: 1.15rem 3.25rem;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  box-shadow: 0 0 44px -10px rgb(218 70 70 / 0.85), 0 14px 30px -18px rgb(0 0 0 / 0.9);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

/* The travelling light: a conic beam spinning behind the face, visible only through the thin ring */
.shimmer-button::before {
  content: "";
  position: absolute;
  inset: -200%;
  z-index: -2;
  background: conic-gradient(from 0deg, transparent 0deg 250deg, rgb(255 255 255 / 0.35) 300deg, #fff 345deg, transparent 360deg);
  animation: shimmer-spin var(--shimmer-speed) linear infinite;
}

/* The face: dark glass (so it stands out on the red background) with a red inner glow,
   inset by the ring width so the travelling light shows as a border */
.shimmer-button::after {
  content: "";
  position: absolute;
  inset: var(--ring);
  z-index: -1;
  border-radius: inherit;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.1), rgb(255 255 255 / 0) 55%),
    rgb(16 14 11 / 0.72);
  box-shadow: inset 0 -10px 16px rgb(218 70 70 / 0.35), inset 0 1px 0 rgb(255 255 255 / 0.18);
  transition: background-color 0.3s ease;
}

.shimmer-button:hover::after {
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.14), rgb(255 255 255 / 0) 55%),
    rgb(16 14 11 / 0.6);
}

/* A slow sweep of light across the face */
.shimmer-button__label {
  position: relative;
  overflow: hidden;
  background: linear-gradient(110deg, #fff 40%, #ffe3e3 50%, #fff 60%);
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shimmer-text calc(var(--shimmer-speed) * 1.25) ease-in-out infinite;
}

.shimmer-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 60px -8px rgb(218 70 70 / 0.95), 0 16px 34px -18px rgb(0 0 0 / 0.9);
}

.shimmer-button:active {
  transform: translateY(0) scale(0.98);
}

@keyframes shimmer-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer-text {
  0%,
  100% {
    background-position: 100% 0;
  }

  50% {
    background-position: 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .shimmer-button::before,
  .shimmer-button__label {
    animation: none;
  }
}
</style>

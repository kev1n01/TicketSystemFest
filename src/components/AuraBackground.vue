<!--
  "Crimson Veil" background from Aura Gradients (auragradients.vercel.app), animated with a slow
  drift so the red horizon rises and settles like stage light.
  The layers use mix-blend-mode against the body color (#100e0b), so they are rendered as
  fixed siblings of the page content and must not be wrapped in a container that creates
  its own stacking context, or the blend would composite against transparency instead.
-->
<template>
  <div class="aura-layer aura-layer-1" aria-hidden="true"></div>
  <div class="aura-layer aura-layer-2" aria-hidden="true"></div>
</template>

<style scoped>
.aura-layer {
  position: fixed;
  /* Taller than the viewport so the drift never exposes an edge */
  inset: -12% 0;
  pointer-events: none;
  /* Crimson Veil stops, toned down (no white band, deeper reds) so glass panels stay legible */
  background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(150, 20, 24, 0.85) 38%, rgba(220, 38, 38, 0.9) 62%, rgb(255, 140, 110) 84%, rgb(251, 146, 60) 100%);
  will-change: transform;
}

.aura-layer-1 {
  mix-blend-mode: hard-light;
  filter: blur(63px);
  opacity: 0.55;
  animation: aura-drift 16s ease-in-out infinite alternate;
}

.aura-layer-2 {
  mix-blend-mode: soft-light;
  filter: blur(88px);
  opacity: 0.8;
  animation: aura-drift 22s ease-in-out -8s infinite alternate-reverse;
}

@media (min-width: 768px) {
  .aura-layer-1 {
    filter: blur(90px);
  }

  .aura-layer-2 {
    filter: blur(126px);
  }
}

@keyframes aura-drift {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(0, -5%, 0) scale(1.04);
  }

  100% {
    transform: translate3d(0, 4%, 0) scale(1.02);
  }
}

@media (prefers-reduced-motion: reduce) {
  .aura-layer {
    animation: none;
  }
}
</style>

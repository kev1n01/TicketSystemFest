<!--
  "Eclipse Flare" background from Aura Gradients (auragradients.vercel.app).
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
  inset: 0;
  pointer-events: none;
  transform: translateZ(0);
  will-change: transform;
}

.aura-layer-1 {
  background: radial-gradient(ellipse 89% 99% at 50% -38%, rgba(0, 0, 0, 0) 0%, rgb(30, 32, 35) 38%, rgb(45, 70, 115) 70%, rgb(142, 123, 227) 90%, rgb(248, 104, 196) 100%);
  mix-blend-mode: hard-light;
  filter: blur(125px);
  opacity: 0.5;
}

.aura-layer-2 {
  background: radial-gradient(ellipse 95% 105% at 50% -34%, rgba(0, 0, 0, 0.15) 0%, rgb(30, 32, 35) 42%, rgb(55, 82, 135) 74%, rgb(150, 126, 228) 92%, rgb(246, 108, 198) 100%);
  mix-blend-mode: soft-light;
  filter: blur(200px);
}

@media (min-width: 768px) {
  .aura-layer-1 {
    filter: blur(180px);
  }

  .aura-layer-2 {
    filter: blur(260px);
  }
}
</style>

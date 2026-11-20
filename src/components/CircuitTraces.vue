<script setup>
import { onMounted, onUnmounted, ref } from "vue";

// Circuit traces taken from the anniversary flyer, pinned to the viewport edges like the aura.
// The page content sits on top of them, so instead of a direct hover they light up around the
// cursor: a lit copy of the traces is revealed through a radial mask that follows the pointer.
const root = ref(null);
let frame = 0;
let pointerX = -9999;
let pointerY = -9999;

const paint = () => {
    frame = 0;
    root.value?.style.setProperty("--mx", `${pointerX}px`);
    root.value?.style.setProperty("--my", `${pointerY}px`);
};

const onPointerMove = (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    root.value?.style.setProperty("--lit", "1");
    if (!frame) frame = requestAnimationFrame(paint);
};

// The pointer left the window: let the traces cool down
const onMouseOut = (event) => {
    if (!event.relatedTarget) root.value?.style.setProperty("--lit", "0");
};

onMounted(() => {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseout", onMouseOut);
});

onUnmounted(() => {
    window.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("mouseout", onMouseOut);
    cancelAnimationFrame(frame);
});

// Drawn from the viewport edge (x = 0) inwards; the right cluster is mirrored in CSS
const clusters = [
    {
        id: "left",
        paths: ["M0 34 H112 L140 62 H252", "M0 84 H76 L96 104 H188", "M0 136 H128 L158 166 H286", "M0 186 H54"],
        nodes: [[252, 62], [188, 104], [286, 166], [54, 186]],
    },
    {
        id: "right",
        paths: ["M0 46 H132 L162 16 H236", "M0 98 H96 L126 128 H262", "M0 156 H64 L84 176 H158"],
        nodes: [[236, 16], [262, 128], [158, 176]],
    },
];
</script>

<template>
    <div ref="root" class="circuits" aria-hidden="true">
        <div v-for="layer in ['base', 'lit']" :key="layer" class="circuits-layer" :class="`circuits-${layer}`">
            <svg v-for="cluster in clusters" :key="cluster.id" class="circuit" :class="`circuit-${cluster.id}`"
                viewBox="0 0 320 200" fill="none">
                <path v-for="d in cluster.paths" :key="d" :d="d" />
                <circle v-for="[cx, cy] in cluster.nodes" :key="`${cx}-${cy}`" :cx="cx" :cy="cy" r="3.5" />
            </svg>
        </div>
    </div>
</template>

<style scoped>
.circuits {
    --mx: -9999px;
    --my: -9999px;
    --lit: 0;
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
}

.circuits-layer {
    position: absolute;
    inset: 0;
}

/* Sized to the side gutters, so the traces barely reach under the content */
.circuit {
    position: absolute;
    width: clamp(180px, calc((100vw - 64rem) / 2 + 5rem), 380px);
    height: auto;
    overflow: visible;
}

.circuit-left {
    left: 0;
    top: 16vh;
}

.circuit-right {
    right: 0;
    bottom: 14vh;
    transform: scaleX(-1);
}

.circuit path {
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
}

.circuits-base path {
    stroke: rgb(255 255 255 / 0.13);
}

.circuits-base circle {
    fill: rgb(255 255 255 / 0.2);
}

/* The lit copy only shows inside a soft circle around the cursor */
.circuits-lit {
    opacity: var(--lit);
    transition: opacity 400ms ease;
    -webkit-mask-image: radial-gradient(circle 200px at var(--mx) var(--my), #000 0%, rgb(0 0 0 / 0.5) 45%, transparent 75%);
    mask-image: radial-gradient(circle 200px at var(--mx) var(--my), #000 0%, rgb(0 0 0 / 0.5) 45%, transparent 75%);
}

.circuits-lit path {
    stroke: #fff;
}

.circuits-lit circle {
    fill: #fff;
}

.circuits-lit .circuit {
    filter: drop-shadow(0 0 2px #fff) drop-shadow(0 0 8px rgb(255 99 99 / 0.95)) drop-shadow(0 0 16px rgb(218 70 70 / 0.7));
}

/* Only where there are side gutters; touch screens keep the quiet traces without the glow */
@media (max-width: 1023px) {
    .circuits {
        display: none;
    }
}

@media (hover: none) {
    .circuits-lit {
        display: none;
    }
}
</style>

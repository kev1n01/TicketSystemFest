<script>
// Pure wheel geometry and labels, kept outside <script setup> so they can be checked on their own.
// Angles are degrees, measured clockwise from 12 o'clock, where the pointer sits.

export const normalizeDegrees = (degrees) => ((degrees % 360) + 360) % 360

/** Index of the segment under the top pointer when the wheel is rotated by `rotation` degrees. */
export function indexAtRotation(rotation, count) {
    if (count <= 0) return -1
    const slice = 360 / count
    return Math.min(count - 1, Math.floor(normalizeDegrees(-rotation) / slice))
}

/**
 * Final rotation that stops the pointer inside segment `index`, after `turns` full turns.
 * `jitter` (0 to 1) places the pointer at random within the middle 70% of that segment.
 */
export function landingRotation(currentRotation, index, count, { turns = 6, jitter = 0.5 } = {}) {
    const slice = 360 / count
    const pointerAngle = (index + 0.15 + 0.7 * jitter) * slice
    return currentRotation + turns * 360 + normalizeDegrees(-pointerAngle - currentRotation)
}

const titleCase = (text) =>
    text.toLocaleLowerCase('es').replace(/(^|[\s'-])(\p{L})/gu, (_, lead, letter) => lead + letter.toLocaleUpperCase('es'))

/** First name plus first surname: "Juan Carlos Pérez López" or "Pérez López, Juan Carlos" become "Juan Pérez". */
export function wheelLabel(fullName) {
    let text = String(fullName ?? '').replace(/\s+/g, ' ').trim()
    if (!text) return 'Sin nombre'
    // Uploaded lists often come in capitals, which are wider and harder to read on a projector.
    if (text === text.toLocaleUpperCase('es') && text !== text.toLocaleLowerCase('es')) text = titleCase(text)
    if (text.includes(',')) {
        const [surnames, names = []] = text.split(',', 2).map((part) => part.trim().split(' ').filter(Boolean))
        return [names[0], surnames[0]].filter(Boolean).join(' ') || text
    }
    const words = text.split(' ')
    return words.length <= 2 ? text : `${words[0]} ${words[words.length - 2]}`
}

/** Shortens a label until `fits(text)` accepts it: "Sebastián Chávez", then "Sebastián C.", then an ellipsis. */
export function fitLabel(label, fits) {
    if (fits(label)) return label
    const [first, ...rest] = label.split(' ')
    if (rest.length) {
        const initialed = `${first} ${rest[0].charAt(0)}.`
        if (fits(initialed)) return initialed
    }
    for (let end = label.length - 1; end > 1; end -= 1) {
        const truncated = `${label.slice(0, end).trimEnd()}…`
        if (fits(truncated)) return truncated
    }
    return `${label.charAt(0)}…`
}
</script>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
    /** Participants shown on the wheel, in order: [{ key, name }]. */
    entries: { type: Array, default: () => [] },
})

// Geometry in SVG user units (the viewBox is centered on the hub)
const VIEW = 264
const RIM_OUTER = 246
const SEGMENT_RADIUS = 228
const PIN_RADIUS = 237
const HUB_RADIUS = 52
const LABEL_INNER = 60
const LABEL_OUTER = 212 // the pointer tip reaches r = 221, so labels stop short of it
const viewBox = `${-VIEW} ${-VIEW} ${VIEW * 2} ${VIEW * 2}`

// Motion
const INITIAL_ROTATION = -15 // the pointer rests inside the first segment, never on a pin
const WINDUP_MS = 420
const WINDUP_DEG = 10
const SPIN_MS = 6400
const KICK_DEG = 16
const KICK_DECAY_MS = 90

// Fills from the fest palette, each with the text color that keeps contrast
const SEGMENT_COLORS = [
    { fill: '#2d4673', text: '#ffffff' }, // stage
    { fill: '#f868c4', text: '#100e0b' }, // flare
    { fill: '#8e7be3', text: '#100e0b' }, // lilac
    { fill: '#da4646', text: '#ffffff' }, // ember
]
const CONFETTI_COLORS = ['#f868c4', '#8e7be3', '#da4646', '#ffffff']

const rotorEl = ref(null)
const pointerEl = ref(null)
const stageEl = ref(null)
const landedIndex = ref(null)
const celebration = ref(0)
const confetti = ref([])
const fontsVersion = ref(0)

const polar = (radius, angle) => {
    const radians = (angle * Math.PI) / 180
    return [Number((radius * Math.sin(radians)).toFixed(2)), Number((-radius * Math.cos(radians)).toFixed(2))]
}

const wedgePath = (start, end, radius) => {
    const [x0, y0] = polar(radius, start)
    const [x1, y1] = polar(radius, end)
    return `M 0 0 L ${x0} ${y0} A ${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 1 ${x1} ${y1} Z`
}

// Neighbors never share a color, including the last segment against the first
const colorFor = (index, count) => {
    if (count > 1 && count % SEGMENT_COLORS.length === 1 && index === count - 1) return SEGMENT_COLORS[2]
    return SEGMENT_COLORS[index % SEGMENT_COLORS.length]
}

let measureContext = null
const textWidth = (text, fontSize) => {
    if (typeof document !== 'undefined') {
        measureContext ??= document.createElement('canvas').getContext('2d')
    }
    if (!measureContext) return text.length * fontSize * 0.6
    measureContext.font = `650 ${fontSize}px Epilogue, ui-sans-serif, system-ui, sans-serif`
    return measureContext.measureText(text).width
}

const segments = computed(() => {
    void fontsVersion.value // re-measure labels once the web font is ready
    const count = props.entries.length
    if (count === 0) return []
    const slice = 360 / count
    const fontSize = count === 1 ? 26 : count <= 4 ? 23 : count <= 8 ? 20 : 17.5
    const fits = (text) => textWidth(text, fontSize) <= LABEL_OUTER - LABEL_INNER
    return props.entries.map((entry, index) => {
        const start = index * slice
        const color = colorFor(index, count)
        return {
            key: entry.key ?? index,
            path: count === 1 ? null : wedgePath(start, start + slice, SEGMENT_RADIUS),
            fill: color.fill,
            textColor: color.text,
            label: fitLabel(wheelLabel(entry.name), fits),
            fontSize,
            labelAngle: start + slice / 2 - 90,
            pin: polar(PIN_RADIUS, start),
        }
    })
})

const placeholderPaths = Array.from({ length: 12 }, (_, index) => wedgePath(index * 30, index * 30 + 30, SEGMENT_RADIUS))
const tickAngles = Array.from({ length: 72 }, (_, index) => index * 5)

const ariaLabel = computed(() => {
    const count = props.entries.length
    if (count === 0) return 'Ruleta del sorteo sin participantes'
    return `Ruleta del sorteo con ${count} ${count === 1 ? 'participante' : 'participantes'}`
})

// ---- Spin animation (JS-driven so it lands exactly, and can skip motion when asked) ----

let rotation = INITIAL_ROTATION
let previousRotation = INITIAL_ROTATION
let lastIndex = -1
let kickAt = -Infinity
let kickDirection = 1
let frameId = 0
let pendingResolve = null
let confettiTimer = 0

const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2
// Custom ease-out: a fast launch, then a long crawl across the last segments to build suspense
const easeOutSpin = (t) => 1 - 0.75 * (1 - t) ** 4 - 0.25 * (1 - t) ** 2

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const applyRotation = (value) => {
    rotation = value
    if (rotorEl.value) rotorEl.value.style.transform = `rotate(${value}deg)`
}

const setPointer = (angle) => {
    pointerEl.value?.setAttribute('transform', `rotate(${angle.toFixed(2)} 0 -252)`)
}

// The pointer flicks each time a pin passes under it, then springs back
const updatePointer = (now, count) => {
    const index = indexAtRotation(rotation, count)
    if (index !== lastIndex) {
        if (lastIndex !== -1) {
            kickAt = now
            kickDirection = rotation >= previousRotation ? 1 : -1
        }
        lastIndex = index
    }
    previousRotation = rotation
    const level = Math.exp(-(now - kickAt) / KICK_DECAY_MS)
    const angle = level < 0.01 ? 0 : -KICK_DEG * kickDirection * level
    setPointer(angle)
    return angle
}

const settle = (landed) => {
    const resolve = pendingResolve
    pendingResolve = null
    resolve?.(landed)
}

const cancelSpin = () => {
    cancelAnimationFrame(frameId)
    frameId = 0
    settle(false)
}

const celebrate = () => {
    const width = stageEl.value?.offsetWidth ?? 320
    confetti.value = Array.from({ length: 36 }, (_, index) => {
        const long = 7 + Math.random() * 7
        return {
            key: index,
            style: {
                '--dx': `${((Math.random() * 2 - 1) * width * 0.46).toFixed(1)}px`,
                '--rise': `${(-(0.04 + Math.random() * 0.14) * width).toFixed(1)}px`,
                '--fall': `${((0.4 + Math.random() * 0.45) * width).toFixed(1)}px`,
                '--turn': `${Math.round(360 + Math.random() * 540)}deg`,
                '--delay': `${Math.round(Math.random() * 140)}ms`,
                '--duration': `${Math.round(1500 + Math.random() * 700)}ms`,
                width: `${long.toFixed(1)}px`,
                height: `${(index % 3 === 0 ? long : long * 0.45).toFixed(1)}px`,
                borderRadius: index % 3 === 0 ? '9999px' : '1px',
                background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
            },
        }
    })
    celebration.value += 1
    clearTimeout(confettiTimer)
    confettiTimer = setTimeout(() => {
        confetti.value = []
    }, 2600)
}

const land = (index) => {
    landedIndex.value = index
    celebrate()
    settle(true)
}

/**
 * Spins the wheel so the pointer stops on segment `index`.
 * Resolves to true once it lands, or false if the spin is cancelled.
 */
function spinTo(index) {
    const count = props.entries.length
    if (count === 0 || index < 0 || index >= count) return Promise.resolve(false)
    cancelSpin()
    landedIndex.value = null
    confetti.value = []

    const target = landingRotation(rotation, index, count, {
        turns: 5 + Math.floor(Math.random() * 2),
        jitter: Math.random(),
    })

    return new Promise((resolve) => {
        pendingResolve = resolve

        // Reduced motion: no spin, the wheel goes straight to the winner and the result still shows
        if (prefersReducedMotion()) {
            applyRotation(target)
            setPointer(0)
            land(index)
            return
        }

        const start = rotation
        const windupEnd = start - WINDUP_DEG
        const startedAt = performance.now()
        let landed = false
        lastIndex = indexAtRotation(rotation, count)
        previousRotation = rotation

        const step = (now) => {
            const elapsed = now - startedAt
            let progress = 0
            if (elapsed < WINDUP_MS) {
                applyRotation(start + (windupEnd - start) * easeInOutSine(elapsed / WINDUP_MS))
            } else {
                progress = Math.min(1, (elapsed - WINDUP_MS) / SPIN_MS)
                applyRotation(windupEnd + (target - windupEnd) * easeOutSpin(progress))
            }
            const pointerAngle = updatePointer(now, count)
            if (progress >= 1 && !landed) {
                landed = true
                land(index)
            }
            // Keep drawing until the pointer has sprung back after the last pin
            if (landed && pointerAngle === 0) {
                frameId = 0
                return
            }
            frameId = requestAnimationFrame(step)
        }
        frameId = requestAnimationFrame(step)
    })
}

defineExpose({ spinTo })

// A new set of participants clears the previous result
watch(
    () => props.entries,
    () => {
        landedIndex.value = null
        lastIndex = -1
    },
)

const bumpFonts = () => {
    fontsVersion.value += 1
}

onMounted(() => {
    applyRotation(rotation)
    document.fonts?.ready?.then(bumpFonts)
    document.fonts?.addEventListener?.('loadingdone', bumpFonts)
})

onBeforeUnmount(() => {
    cancelSpin()
    clearTimeout(confettiTimer)
    document.fonts?.removeEventListener?.('loadingdone', bumpFonts)
})
</script>

<template>
    <div ref="stageEl" class="raffle-wheel" :class="{ 'is-landed': landedIndex !== null }" role="img"
        :aria-label="ariaLabel">
        <!-- Rotating part: rim, pins and the named segments -->
        <div ref="rotorEl" class="rotor">
            <svg :viewBox="viewBox" aria-hidden="true" focusable="false">
                <defs>
                    <filter id="raffle-wheel-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <circle :r="RIM_OUTER" class="rim" />
                <g class="ticks">
                    <line v-for="angle in tickAngles" :key="angle" x1="0" :y1="-(RIM_OUTER - 4)" x2="0"
                        :y2="-(SEGMENT_RADIUS + 5)" :transform="`rotate(${angle})`" />
                </g>

                <template v-if="segments.length">
                    <g v-for="(segment, index) in segments" :key="segment.key" class="segment"
                        :class="{ 'is-dimmed': landedIndex !== null && index !== landedIndex }">
                        <circle v-if="!segment.path" :r="SEGMENT_RADIUS" :fill="segment.fill" class="segment-shape" />
                        <path v-else :d="segment.path" :fill="segment.fill" class="segment-shape" />
                        <text :x="LABEL_OUTER" y="0" dy="0.35em" text-anchor="end" :fill="segment.textColor"
                            :font-size="segment.fontSize" :transform="`rotate(${segment.labelAngle})`"
                            class="segment-label">{{ segment.label }}</text>
                    </g>

                    <template v-if="landedIndex !== null && segments[landedIndex]">
                        <circle v-if="!segments[landedIndex].path" :r="SEGMENT_RADIUS - 2" class="winner-outline"
                            filter="url(#raffle-wheel-glow)" />
                        <path v-else :d="segments[landedIndex].path" class="winner-outline"
                            filter="url(#raffle-wheel-glow)" />
                    </template>

                    <circle v-for="segment in segments" :key="`pin-${segment.key}`" :cx="segment.pin[0]"
                        :cy="segment.pin[1]" r="4.5" class="pin" />
                </template>

                <g v-else class="placeholder">
                    <path v-for="(path, index) in placeholderPaths" :key="index" :d="path"
                        :class="index % 2 ? 'is-light' : ''" />
                </g>
            </svg>
        </div>

        <!-- Static part: glass sheen, hub and the pointer -->
        <svg class="overlay" :viewBox="viewBox" aria-hidden="true" focusable="false">
            <defs>
                <radialGradient id="raffle-wheel-vignette" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0.6" stop-color="#100e0b" stop-opacity="0" />
                    <stop offset="1" stop-color="#100e0b" stop-opacity="0.45" />
                </radialGradient>
                <radialGradient id="raffle-wheel-sheen" cx="0.3" cy="0.18" r="0.62">
                    <stop offset="0" stop-color="#ffffff" stop-opacity="0.22" />
                    <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
                </radialGradient>
                <linearGradient id="raffle-wheel-hub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#3a3f4a" />
                    <stop offset="1" stop-color="#100e0b" />
                </linearGradient>
                <linearGradient id="raffle-wheel-pointer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#ffffff" />
                    <stop offset="1" stop-color="#e4dcfb" />
                </linearGradient>
                <filter id="raffle-wheel-shadow" x="-60%" y="-60%" width="220%" height="220%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.55" />
                </filter>
            </defs>

            <circle :r="SEGMENT_RADIUS" fill="url(#raffle-wheel-vignette)" />
            <circle :r="SEGMENT_RADIUS" fill="url(#raffle-wheel-sheen)" />
            <circle :r="HUB_RADIUS" fill="url(#raffle-wheel-hub)" stroke="#8e7be3" stroke-opacity="0.8" stroke-width="3"
                filter="url(#raffle-wheel-shadow)" />
            <circle :r="HUB_RADIUS - 16" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5" />

            <g ref="pointerEl" filter="url(#raffle-wheel-shadow)">
                <path d="M -19 -248 Q -19 -262 -5 -262 L 5 -262 Q 19 -262 19 -248 L 3.5 -224 Q 0 -218 -3.5 -224 Z"
                    fill="url(#raffle-wheel-pointer)" stroke="#100e0b" stroke-width="2" stroke-linejoin="round" />
                <circle cx="0" cy="-251" r="4.5" fill="#f868c4" />
            </g>
        </svg>

        <!-- One-shot celebration when the wheel stops -->
        <template v-if="confetti.length">
            <span :key="`burst-${celebration}`" class="burst" aria-hidden="true"></span>
            <div :key="`confetti-${celebration}`" class="confetti" aria-hidden="true">
                <i v-for="piece in confetti" :key="piece.key" :style="piece.style"></i>
            </div>
        </template>
    </div>
</template>

<style scoped>
.raffle-wheel {
    position: relative;
    width: min(100%, 560px);
    /* Keep the whole wheel on screen on short projector displays */
    width: min(100%, 560px, max(18rem, calc(100svh - 15rem)));
    aspect-ratio: 1;
    flex-shrink: 0;
}

/* Soft stage light behind the wheel; it brightens when a winner lands */
.raffle-wheel::before {
    content: "";
    position: absolute;
    inset: 4%;
    border-radius: 9999px;
    box-shadow:
        0 0 70px 4px rgba(142, 123, 227, 0.35),
        0 0 140px 16px rgba(248, 104, 196, 0.16);
    transition: box-shadow 0.8s ease;
}

.raffle-wheel.is-landed::before {
    box-shadow:
        0 0 80px 10px rgba(142, 123, 227, 0.5),
        0 0 160px 28px rgba(248, 104, 196, 0.3);
}

.rotor,
.overlay {
    position: absolute;
    inset: 0;
}

.rotor {
    will-change: transform;
}

svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
}

.rim {
    fill: #100e0b;
    stroke: rgba(255, 255, 255, 0.16);
    stroke-width: 1.5;
}

.ticks line {
    stroke: rgba(255, 255, 255, 0.22);
    stroke-width: 1.5;
    stroke-linecap: round;
}

.segment {
    transition: opacity 0.5s ease;
}

.segment.is-dimmed {
    opacity: 0.28;
}

.segment-shape {
    stroke: #100e0b;
    stroke-width: 2.5;
    stroke-linejoin: round;
}

.segment-label {
    font-weight: 650;
    pointer-events: none;
}

.winner-outline {
    fill: none;
    stroke: #ffffff;
    stroke-width: 5;
    stroke-linejoin: round;
    animation: outline-in 0.5s ease-out both;
}

.pin {
    fill: #f4f1ff;
    stroke: #100e0b;
    stroke-width: 1.5;
}

.placeholder path {
    fill: rgba(255, 255, 255, 0.04);
    stroke: #100e0b;
    stroke-width: 2.5;
}

.placeholder path.is-light {
    fill: rgba(255, 255, 255, 0.08);
}

/* Light burst at the pointer */
.burst {
    position: absolute;
    left: 50%;
    top: 8%;
    width: 46%;
    aspect-ratio: 1;
    border-radius: 9999px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(248, 104, 196, 0.45) 30%, rgba(142, 123, 227, 0) 68%);
    mix-blend-mode: screen;
    pointer-events: none;
    opacity: 0;
    animation: burst 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1 both;
}

/* Confetti flies out of the pointer, then falls across the wheel. Clipped sideways so phones never scroll. */
.confetti {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    overflow-x: clip;
    overflow-y: visible;
}

.confetti i {
    position: absolute;
    left: 50%;
    top: 8%;
    opacity: 0;
    animation: confetti-fly var(--duration) var(--delay) 1 both;
}

@keyframes outline-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes burst {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.2);
    }

    15% {
        opacity: 1;
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(1.9);
    }
}

@keyframes confetti-fly {
    0% {
        opacity: 0;
        transform: translate(-50%, 0) rotate(0deg) scale(0.4);
        animation-timing-function: cubic-bezier(0.15, 0.7, 0.3, 1);
    }

    10% {
        opacity: 1;
    }

    35% {
        opacity: 1;
        transform: translate(calc(-50% + var(--dx) * 0.7), var(--rise)) rotate(calc(var(--turn) * 0.4)) scale(1);
        animation-timing-function: cubic-bezier(0.5, 0, 0.8, 0.6);
    }

    100% {
        opacity: 0;
        transform: translate(calc(-50% + var(--dx)), var(--fall)) rotate(var(--turn)) scale(1);
    }
}

@media (prefers-reduced-motion: reduce) {

    .burst,
    .confetti {
        display: none;
    }
}
</style>

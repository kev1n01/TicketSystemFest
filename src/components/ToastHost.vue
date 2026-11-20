<script setup>
import { CircleCheck, CircleAlert, X } from "lucide-vue-next";
import { useToastStack } from "../composables/useToast";

const { items, pause, resume, dismiss } = useToastStack();

// A leaving toast is taken out of the flow at its current spot, so the rest slide up smoothly
const freezePosition = (el) => {
    el.style.top = `${el.offsetTop}px`;
    el.style.left = `${el.offsetLeft}px`;
    el.style.width = `${el.offsetWidth}px`;
};
</script>

<template>
    <div class="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4 sm:left-auto sm:right-4 sm:px-0"
        aria-live="polite">
        <TransitionGroup tag="ol" name="toast" class="relative flex w-full max-w-sm flex-col gap-2.5"
            @before-leave="freezePosition">
            <li v-for="item in items" :key="item.id" class="toast pointer-events-auto" :class="`toast--${item.type}`"
                :role="item.type === 'error' ? 'alert' : 'status'" @mouseenter="pause(item.id)"
                @mouseleave="resume(item.id)" @focusin="pause(item.id)" @focusout="resume(item.id)">
                <component :is="item.type === 'error' ? CircleAlert : CircleCheck" class="toast-icon mt-0.5 h-5 w-5 shrink-0"
                    aria-hidden="true" />

                <div class="min-w-0 flex-1">
                    <p v-if="item.title" class="font-semibold leading-snug">{{ item.title }}</p>
                    <p class="text-sm leading-snug text-white/75" :class="{ 'mt-0.5': item.title }">{{ item.message }}</p>
                </div>

                <button type="button"
                    class="-mr-2 -mt-2 inline-flex h-10 w-10 shrink-0 items-center justify-center text-white/50 transition-colors hover:text-white"
                    aria-label="Cerrar notificación" @click="dismiss(item.id)">
                    <X class="h-4 w-4" aria-hidden="true" />
                </button>

                <!-- Time left before it closes; restarts when the same notice fires again -->
                <span :key="item.cycle" class="toast-progress" aria-hidden="true"
                    :style="{ animationDuration: `${item.duration}ms`, animationPlayState: item.paused ? 'paused' : 'running' }" />
            </li>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.toast {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    overflow: hidden;
    padding: 0.875rem 0.875rem 1rem 1.125rem;
    border: 1px solid rgb(255 255 255 / 0.1);
    border-radius: 1rem;
    background: rgb(16 14 11 / 0.84);
    box-shadow: 0 24px 60px -24px rgb(0 0 0 / 0.9);
    backdrop-filter: blur(16px);
}

/* Lit left edge, same language as the active nav item */
.toast::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.875rem;
    bottom: 0.875rem;
    width: 2px;
    border-radius: 9999px;
    background: var(--toast-accent);
    box-shadow: 0 0 8px 1px var(--toast-glow);
}

.toast--success {
    --toast-accent: #34d399;
    --toast-glow: rgb(52 211 153 / 0.55);
}

.toast--error {
    --toast-accent: #da4646;
    --toast-glow: rgb(218 70 70 / 0.8);
}

.toast-icon {
    color: var(--toast-accent);
}

.toast-progress {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: var(--toast-accent);
    opacity: 0.5;
    transform-origin: left;
    animation-name: toast-countdown;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
}

@keyframes toast-countdown {
    from {
        transform: scaleX(1);
    }

    to {
        transform: scaleX(0);
    }
}

/* Enter: drops in from the top with a slight overshoot. Leave: slides out to the side. */
.toast-enter-active {
    transition: opacity 260ms ease-out, filter 260ms ease-out, transform 460ms cubic-bezier(0.21, 1.02, 0.73, 1);
}

.toast-enter-from {
    opacity: 0;
    filter: blur(4px);
    transform: translateY(-16px) scale(0.95);
}

.toast-leave-active {
    position: absolute;
    transition: opacity 200ms ease-in, transform 220ms ease-in;
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(32px) scale(0.97);
}

.toast-move {
    transition: transform 320ms cubic-bezier(0.21, 1.02, 0.73, 1);
}
</style>

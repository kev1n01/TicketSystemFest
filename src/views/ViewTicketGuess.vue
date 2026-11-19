<template>
  <DashLayout>
    <div class="mt-2 w-full max-w-sm sm:mt-6">
      <article id="ticket" class="ticket">
        <!-- Pass body: event and holder -->
        <div class="rounded-t-[1.75rem] bg-white px-6 pb-6 pt-7 text-ink">
          <h1 class="font-dastress pl-1 pt-2 text-5xl leading-[1.1] text-ember sm:text-[3.5rem]">System Fest</h1>
          <p class="mt-2 text-sm text-ink/65">32.º aniversario de Ingeniería de Sistemas e Informática</p>

          <div class="mt-7">
            <p class="break-words text-2xl font-bold leading-tight">{{ userData.nombres }}</p>
            <p class="mt-1 tabular-nums text-ink/70">DNI: {{ userData.dni }}</p>
            <span
              class="mt-4 inline-flex items-center gap-2 rounded-full bg-ink/[0.06] px-3 py-1.5 text-sm font-semibold">
              <span class="h-2 w-2 rounded-full bg-flare" aria-hidden="true"></span>
              Ticket invitado
            </span>
          </div>

          <dl class="mt-7 grid grid-cols-2 gap-4 border-t border-ink/10 pt-5">
            <div>
              <dt class="text-xs text-ink/65">Fecha</dt>
              <dd class="mt-0.5 text-sm font-semibold">29 de noviembre</dd>
            </div>
            <div>
              <dt class="text-xs text-ink/65">Hora</dt>
              <dd class="mt-0.5 text-sm font-semibold">1:00 p. m.</dd>
            </div>
            <div class="col-span-2">
              <dt class="text-xs text-ink/65">Lugar</dt>
              <dd class="mt-0.5 text-sm font-semibold">Mistika casa club</dd>
            </div>
          </dl>
        </div>

        <!-- Perforation: the notches are masked out, so the aura shows through them -->
        <div class="ticket-perforation" aria-hidden="true"></div>

        <!-- QR stub -->
        <div class="flex flex-col items-center rounded-b-[1.75rem] bg-white px-6 pb-7 pt-2 text-ink">
          <img :src="userData.qrCode" alt="Código QR de tu ticket" width="208" height="208"
            class="h-52 w-52 [image-rendering:pixelated]" />
          <p class="mt-3 text-center text-sm font-medium text-ink/70">Muestra este código en la entrada</p>
        </div>
      </article>

      <p class="mt-6 text-center text-sm text-white/60">
        Sube el brillo de tu pantalla para que el código se lea al primer intento.
      </p>
    </div>
  </DashLayout>

</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from '../stores/userStore';
import DashLayout from "../layout/DashLayout.vue";

const userStore = useUserStore();
const router = useRouter();
const userData = ref({ dni: "", nombres: "", qrCode: "" });

onMounted(() => {
  if (!userStore.userHashCode || !userStore.userQr) {
    router.push("/generate-ticket-guess");
    return;
  }

  // Cargar datos desde localStorage
  userData.value.dni = userStore.userDni;
  userData.value.nombres = userStore.userFullName;
  userData.value.qrCode = userStore.userQr;

});


</script>

<style scoped>
.ticket {
  filter: drop-shadow(0 28px 48px rgba(0, 0, 0, 0.55));
  animation: ticket-reveal 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

/* White strip whose edge notches are cut with a mask (not painted), plus the dashed tear line */
.ticket-perforation {
  --notch: 0.875rem;
  position: relative;
  height: 2rem;
  /* Overlap the neighbours by 1px so no hairline seam shows between the white blocks */
  margin: -1px 0;
  background: #fff;
  -webkit-mask:
    radial-gradient(circle at 0 50%, transparent var(--notch), #000 calc(var(--notch) + 0.5px)) left / 51% 100% no-repeat,
    radial-gradient(circle at 100% 50%, transparent var(--notch), #000 calc(var(--notch) + 0.5px)) right / 51% 100% no-repeat;
  mask:
    radial-gradient(circle at 0 50%, transparent var(--notch), #000 calc(var(--notch) + 0.5px)) left / 51% 100% no-repeat,
    radial-gradient(circle at 100% 50%, transparent var(--notch), #000 calc(var(--notch) + 0.5px)) right / 51% 100% no-repeat;
}

.ticket-perforation::before {
  content: '';
  position: absolute;
  top: 50%;
  left: calc(var(--notch) + 0.5rem);
  right: calc(var(--notch) + 0.5rem);
  border-top: 2px dashed rgba(30, 32, 35, 0.22);
  transform: translateY(-50%);
}

@keyframes ticket-reveal {
  from {
    opacity: 0;
    transform: translateY(1.5rem) rotate(-1.5deg);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
</style>

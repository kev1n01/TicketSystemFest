<template>
  <DashLayout>
    <div class="mt-2 w-full max-w-sm sm:mt-6">
      <EventTicket :full-name="userData.fullName" id-label="Código" :id-value="userData.code" type="estudiante"
        :qr-code="userData.qrCode" />

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
import EventTicket from "../components/EventTicket.vue";

const userStore = useUserStore();
const router = useRouter();
const userData = ref({ code: "", fullName: "", qrCode: "" });

onMounted(() => {
  if (!userStore.userHashCode || !userStore.userQr) {
    router.push("/generate-ticket");
    return;
  }

  // Cargar datos desde localStorage
  userData.value.code = userStore.userCode;
  userData.value.fullName = userStore.userFullName;
  userData.value.qrCode = userStore.userQr;
});
</script>

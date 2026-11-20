<script setup>
// Source: official flyer of the 34th anniversary of the academic program (22-28 November 2026)
const activities = [
    {
        date: "2026-11-22",
        day: "22",
        month: "nov",
        title: "Desfile Institucional",
        details: [
            { term: "Hora", value: "7:00 a. m." },
            { term: "Lugar", value: "Plaza de Armas" },
            { term: "Encuentro", value: "Entrada principal de la Catedral" },
        ],
        dressCode: [
            {
                group: "chicas",
                items: ["Pantalón azul presidencial", "Blusa blanca", "Pañoleta del Programa Académico"],
            },
            {
                group: "chicos",
                items: ["Pantalón azul presidencial", "Camisa blanca", "Corbata del Programa Académico"],
            },
        ],
    },
    {
        date: "2026-11-22",
        day: "22",
        month: "nov",
        title: "Paseo de Integración",
        summary: "Incluye actividades de inscripción para el campeonato de vóley y fútbol.",
        details: [
            { term: "Hora", value: "8:30 a. m." },
            { term: "Lugar", value: "Playa Huallaga" },
        ],
        phones: ["925224226"],
    },
    {
        date: "2026-11-24",
        day: "24",
        month: "nov",
        title: "Concurso de Robots",
        details: [
            { term: "Hora", value: "3:00 p. m." },
            { term: "Lugar", value: "Entrada de la universidad, La Esperanza" },
        ],
        phones: ["918622648", "970255660"],
    },
    {
        date: "2026-11-26",
        day: "26",
        month: "nov",
        title: "Congreso CIMA 2026",
        tagline: "Inteligencia, Modernización y Automatización",
        details: [
            { term: "Horario", value: ["8:30 a. m. – 1:00 p. m.", "3:00 p. m. – 7:00 p. m."] },
            { term: "Lugar", value: ["Auditorio del Colegio de Ingenieros", "Jr. 28 de Julio #340"] },
            { term: "Modalidad", value: "Presencial" },
        ],
        phones: ["970255660", "944560837", "918622648"],
    },
    {
        date: "2026-11-28",
        day: "28",
        month: "nov",
        title: "Almuerzo de Confraternidad",
        // The QR ticket generated in this app is checked at this activity's entrance
        withTicket: true,
        details: [
            { term: "Misa", value: "10:30 a. m." },
            { term: "Almuerzo", value: "12:30 p. m." },
            { term: "Lugar", value: "Mistika Casa Club" },
        ],
        phones: ["970255660", "944560837", "918622648"],
    },
];

// One row per date: activities on the same day share it (22 nov has two)
const days = activities.reduce((groups, activity) => {
    const last = groups[groups.length - 1];
    if (last?.date === activity.date) {
        last.activities.push(activity);
    } else {
        groups.push({ date: activity.date, day: activity.day, month: activity.month, activities: [activity] });
    }
    return groups;
}, []);

const hasTicket = (day) => day.activities.some((activity) => activity.withTicket);
const lines = (value) => [].concat(value);
const formatPhone = (phone) => phone.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
</script>

<template>
    <section id="programacion" class="scroll-mt-24 py-16 sm:py-20">
        <div class="lg:grid lg:grid-cols-3 lg:gap-10">
            <div>
                <h2 class="text-2xl font-semibold sm:text-3xl">Programación</h2>
                <p class="mt-2 text-white/70">
                    Del 22 al 28 de noviembre. Participa de nuestras actividades por el aniversario de nuestro programa.
                </p>
            </div>

            <ol class="glass-panel mt-6 divide-y divide-white/10 overflow-hidden lg:col-span-2 lg:mt-0">
                <li v-for="day in days" :key="day.date"
                    class="relative px-5 py-6 sm:grid sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-6 sm:px-6"
                    :class="{ 'ticket-row': hasTicket(day) }">
                    <!-- The date is the row marker: the list is ordered by day.
                         On phones it sits above the details so they get the full width. -->
                    <time :datetime="day.date"
                        class="flex items-baseline gap-1.5 leading-none sm:flex-col sm:items-start sm:gap-0">
                        <span class="text-3xl font-bold tabular-nums sm:text-4xl">{{ day.day }}</span>
                        <span class="text-sm text-white/60 sm:mt-1.5">{{ day.month }}</span>
                    </time>

                    <!-- Same-day activities stack under one date, split only within the content column -->
                    <div class="mt-3 min-w-0 divide-y divide-white/[0.08] sm:mt-0">
                        <div v-for="activity in day.activities" :key="activity.title" class="py-5 first:pt-0 last:pb-0">
                            <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
                                <h3 class="text-lg font-semibold leading-snug sm:text-xl">{{ activity.title }}</h3>
                                <span v-if="activity.withTicket"
                                    class="inline-flex items-center rounded-full border border-white/25 px-2.5 py-0.5 text-xs font-semibold text-white/85">
                                    Ingreso con ticket
                                </span>
                            </div>
                            <p v-if="activity.tagline" class="mt-1 text-white/80">“{{ activity.tagline }}”</p>
                            <p v-if="activity.summary" class="mt-1 text-white/75">{{ activity.summary }}</p>

                            <!-- Fixed label column so values line up across every activity -->
                            <dl class="mt-3 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 sm:grid-cols-[6rem_minmax(0,1fr)]">
                                <template v-for="detail in activity.details" :key="detail.term">
                                    <dt class="text-white/55">{{ detail.term }}</dt>
                                    <dd class="text-white/90">
                                        <span v-for="line in lines(detail.value)" :key="line" class="block tabular-nums">
                                            {{ line }}
                                        </span>
                                    </dd>
                                </template>
                            </dl>

                            <div v-if="activity.dressCode"
                                class="mt-4 grid gap-4 rounded-2xl border border-white/10 p-4 sm:grid-cols-2">
                                <div v-for="dress in activity.dressCode" :key="dress.group">
                                    <p class="text-sm font-semibold">Vestimenta ({{ dress.group }})</p>
                                    <ul class="mt-1.5 list-disc space-y-0.5 pl-5 text-sm text-white/75 marker:text-white">
                                        <li v-for="item in dress.items" :key="item">{{ item }}</li>
                                    </ul>
                                </div>
                            </div>

                            <div v-if="activity.phones" class="mt-2 flex flex-wrap items-center gap-x-4 text-sm">
                                <span class="text-white/55">Más información</span>
                                <a v-for="phone in activity.phones" :key="phone" :href="`tel:+51${phone}`"
                                    class="inline-flex min-h-11 items-center font-medium tabular-nums text-white/85 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white">
                                    {{ formatPhone(phone) }}
                                </a>
                            </div>
                        </div>
                    </div>
                </li>
            </ol>
        </div>
    </section>
</template>

<style scoped>
/* The activity the QR ticket is for: lit edge, same language as the active nav item */
.ticket-row {
    background: rgb(255 255 255 / 0.04);
}

.ticket-row::before {
    content: "";
    position: absolute;
    left: 0;
    top: 1.5rem;
    bottom: 1.5rem;
    width: 2px;
    border-radius: 9999px;
    background: #da4646;
    box-shadow: 0 0 8px 1px rgb(218 70 70 / 0.8);
}
</style>

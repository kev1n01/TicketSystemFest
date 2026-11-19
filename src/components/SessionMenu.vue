<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ChevronDown } from "lucide-vue-next";
import { useUserStore } from "../stores/userStore";

const emit = defineEmits(["open"]);

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const menuId = `session-menu-${useId()}`;
const triggerId = `${menuId}-trigger`;
const isOpen = ref(false);
const rootRef = ref(null);
const triggerRef = ref(null);
const menuRef = ref(null);

const isAdmin = computed(() => Boolean(userStore.username));

const displayName = computed(() => (isAdmin.value ? userStore.username : userStore.userFullName) ?? "");

const roleLabel = computed(() => {
    if (isAdmin.value) return "Staff";
    if (userStore.userCode) return "Estudiante";
    if (userStore.userDni) return "Invitado";
    return "";
});

const items = computed(() => {
    if (isAdmin.value) {
        return [
            { to: "/scanner", label: "Escanear" },
            { to: "/historial-register", label: "Historial" },
            { to: "/lottery", label: "Sorteo" },
        ];
    }
    return [
        { to: userStore.userDni ? "/view-ticket-guess" : "/view-ticket", label: "Mi ticket" },
        { to: "/view-winner", label: "Ganadores" },
    ];
});

const menuItems = () => Array.from(menuRef.value?.querySelectorAll('[role="menuitem"]') ?? []);

// Wraps around, so -1 focuses the last item
const focusItem = (index) => {
    const list = menuItems();
    if (list.length) list[(index + list.length) % list.length].focus();
};

const openMenu = async (focusIndex = null) => {
    if (!isOpen.value) {
        isOpen.value = true;
        emit("open");
    }
    if (focusIndex !== null) {
        await nextTick();
        focusItem(focusIndex);
    }
};

const closeMenu = ({ returnFocus = false } = {}) => {
    if (!isOpen.value) return;
    isOpen.value = false;
    if (returnFocus) triggerRef.value?.focus();
};

const toggleMenu = () => (isOpen.value ? closeMenu() : openMenu());

const onTriggerKeydown = (event) => {
    if (event.key === "ArrowDown") {
        event.preventDefault();
        openMenu(0);
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        openMenu(-1);
    }
};

const onMenuKeydown = (event) => {
    const current = menuItems().indexOf(document.activeElement);
    const targets = { ArrowDown: current + 1, ArrowUp: current - 1, Home: 0, End: -1 };
    if (event.key in targets) {
        event.preventDefault();
        focusItem(targets[event.key]);
    }
};

// Tabbing out of the menu closes it
const onFocusOut = (event) => {
    if (event.relatedTarget && !rootRef.value?.contains(event.relatedTarget)) closeMenu();
};

const onDocumentPointerDown = (event) => {
    if (isOpen.value && !rootRef.value?.contains(event.target)) closeMenu();
};

const onDocumentKeydown = (event) => {
    if (isOpen.value && event.key === "Escape") closeMenu({ returnFocus: true });
};

const logout = () => {
    const redirect = isAdmin.value ? "/admin" : "/home";
    closeMenu();
    userStore.logout();
    router.push(redirect);
};

watch(() => route.fullPath, () => closeMenu());

onMounted(() => {
    document.addEventListener("pointerdown", onDocumentPointerDown);
    document.addEventListener("keydown", onDocumentKeydown);
});

onUnmounted(() => {
    document.removeEventListener("pointerdown", onDocumentPointerDown);
    document.removeEventListener("keydown", onDocumentKeydown);
});
</script>

<template>
    <div ref="rootRef" class="relative min-w-0" @focusout="onFocusOut">
        <button :id="triggerId" ref="triggerRef" type="button"
            class="flex min-h-11 max-w-full items-center gap-2 rounded-xl border border-white/15 py-1.5 pl-3 pr-2.5 text-left transition-colors hover:bg-white/10"
            :class="isOpen ? 'bg-white/10' : 'bg-white/5'" aria-haspopup="menu" :aria-expanded="isOpen"
            :aria-controls="menuId" @click="toggleMenu" @keydown="onTriggerKeydown">
            <span class="flex min-w-0 flex-col leading-tight">
                <span class="truncate text-sm font-semibold lg:max-w-[12rem]" :title="displayName">{{ displayName }}</span>
                <span class="text-xs text-white/60">{{ roleLabel }}</span>
            </span>
            <ChevronDown class="h-4 w-4 shrink-0 text-white/60 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }" aria-hidden="true" />
        </button>

        <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="-translate-y-1 opacity-0"
            leave-active-class="transition duration-100 ease-in" leave-to-class="-translate-y-1 opacity-0">
            <div v-if="isOpen" :id="menuId" ref="menuRef" role="menu" :aria-labelledby="triggerId"
                class="glass-panel absolute right-0 top-full z-50 mt-2 flex w-56 max-w-[calc(100vw-2rem)] flex-col gap-0.5 rounded-2xl bg-night/90 p-2"
                @keydown="onMenuKeydown">
                <RouterLink v-for="item in items" :key="item.to" :to="item.to" role="menuitem" class="menu-item"
                    :class="route.path === item.to ? 'nav-active-side' : 'text-white/80'"
                    :aria-current="route.path === item.to ? 'page' : undefined">
                    {{ item.label }}
                </RouterLink>
                <div class="my-1 border-t border-white/10" role="separator"></div>
                <button type="button" role="menuitem" class="menu-item text-white/80" @click="logout">
                    Cerrar sesión
                </button>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.menu-item {
    @apply flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm font-semibold transition-colors hover:bg-white/5 hover:text-white focus-visible:bg-white/5;
}
</style>

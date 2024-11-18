<script setup>
import { useUserStore } from '../stores/userStore';
import { Terminal, Ticket, LogOut } from 'lucide-vue-next'
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();

const handleLogout = (redirect = "/home") => {

    userStore.logout();
    router.push(redirect);
};
</script>
<template>
    <div
        class="flex items-center justify-center min-h-screen h-max bg-gradient-to-br from-red-900 to-black text-white px-4 sm:px-6 lg:px-8 font-epilogue mb-0">

        <nav
            class="2xl:mx-80 xl:mx-48 lg:mx-42 md:mx-42 sm:mx-32 mx-5 lg:px-12 xs:px-5 p-4 backdrop-blur-2xl bg-black/70 fixed top-0 left-0 right-0 z-50 border border-white/20 rounded-3xl rounded-tr-none rounded-tl-none">
            <div class="flex items-center justify-between text-white font-epilogue font-semibold">
                <!-- Logo -->
                <a href="/home" class="hover:scale-105 transition-transform font-semibold text-2xl">
                    <div class="flex items-center content-center">
                        <span class="pt-1 mr-1">PAISI</span>
                        <Terminal />
                    </div>
                </a>

                <!-- Desktop Menu -->
                <div class="flex items-center xs:gap-2 md:gap-12 font-semibold">
                    <a href="#ticket" v-if="userStore.userDni"
                        class="text-red-300 cursor-pointer flex items-center content-center gap-1">
                        <Ticket class="w-5 h-5" />
                        Mi Ticket
                    </a>
                    <button type="button" @click="handleLogout(userStore.username ? '/admin' : '/home')"
                        class="flex items-center content-center gap-1 hover:shadow-[0_2px_6px_#ff0000] hover:shadow-red-500/80 p-2 rounded-lg">
                        <LogOut class="w-5 h-5" />
                        Salir
                    </button>
                </div>
            </div>
        </nav>

        <slot />
    </div>
</template>

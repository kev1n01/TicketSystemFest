import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css'; // Importamos Tailwind CSS
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia();

pinia.use(({ store }) => {
    store.router = markRaw(router)
})

pinia.use(piniaPluginPersistedstate)

const app = createApp(App);

app.use(pinia); // Usamos Pinia
app.use(router); // Usamos Vue Router

app.mount('#app');

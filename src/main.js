import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css'; // Importamos Tailwind CSS

const app = createApp(App);
const pinia = createPinia();

app.use(pinia); // Usamos Pinia
app.use(router); // Usamos Vue Router

app.mount('#app');

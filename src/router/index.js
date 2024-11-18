import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/userStore';

// Importación de vistas
const ParticipantRegister = () => import('../views/ParticipantRegister.vue');
const ParticipantDetails = () => import('../views/ParticipantDetails.vue');
const AdminLogin = () => import('../views/AdminLogin.vue');
const AdminScanner = () => import('../views/AdminScanner.vue');
const NotFound = () => import('../views/NotFound.vue');

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { requiresNoAuth: true }
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/generate-ticket',
    name: 'ParticipantRegister',
    component: ParticipantRegister,
    meta: { requiresNoAuth: true }
  },
  {
    path: '/participant-details',
    name: 'ParticipantDetails',
    component: ParticipantDetails,
    meta: { requiresParticipant: true },
  },
  {
    path: '/admin',
    name: 'AdminLogin',
    component: AdminLogin,
    meta: { requiresNoAuth: true }
  },
  {
    path: '/scanner',
    name: 'AdminScanner',
    component: AdminScanner,
    meta: { requiresAdmin: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { requiresNoAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // Rutas que requieren ser admin
  if (to.meta.requiresAdmin && !userStore.userHashCode) {
    next('/admin');
    return;
  }

  // Rutas que requieren ser participante
  if (to.meta.requiresParticipant && !userStore.userHashCode) {
    next('/generate-ticket');
    return;
  }

  // Rutas que requieren no estar autenticado
  if (to.meta.requiresNoAuth) {
    if (userStore.username !== null && to.path === '/admin') {
      next('/scanner');
      return;
    }
    if (userStore.userQr !== null && to.path === '/generate-ticket') {
      next('/participant-details');
      return;
    }
  }

  next();
});

export default router;
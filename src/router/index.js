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
    path: '/',
    redirect: '/register'
  },
  {
    path: '/register',
    name: 'ParticipantRegister',
    component: ParticipantRegister,
    meta: { requiresNoAuth: true }
  },
  {
    path: '/participant-details',
    name: 'ParticipantDetails',
    component: ParticipantDetails,
    meta: { requiresParticipant: true },
    beforeEnter: (to, from, next) => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        next();
      } else {
        next('/register');
      }
    }
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
    beforeEnter: (to, from, next) => {
      const adminSession = localStorage.getItem('adminSession');
      if (adminSession) {
        next();
      } else {
        next('/admin');
      }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const adminSession = localStorage.getItem('adminSession');
  const userInfo = localStorage.getItem('userInfo');

  // Rutas que requieren ser admin
  if (to.meta.requiresAdmin && !adminSession) {
    next('/admin');
    return;
  }

  // Rutas que requieren ser participante
  if (to.meta.requiresParticipant && !userInfo) {
    next('/register');
    return;
  }

  // Rutas que requieren no estar autenticado
  if (to.meta.requiresNoAuth) {
    if (adminSession) {
      next('/scanner');
      return;
    }
    if (userInfo && to.path === '/register') {
      next('/participant-details');
      return;
    }
  }

  next();
});

export default router;
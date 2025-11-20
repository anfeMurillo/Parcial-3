import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import EventDetailsView from '../views/EventDetailsView.vue';
import MyTicketsView from '../views/MyTicketsView.vue';
import { useAuthStore } from '../stores/auth';

// Configuración del enrutador
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
        },
        {
            path: '/events/:id',
            name: 'event-details',
            component: EventDetailsView,
        },
        {
            path: '/my-tickets',
            name: 'my-tickets',
            component: MyTicketsView,
            meta: { requiresAuth: true },
        },
    ],
});

// Guardia de navegación global
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.token) {
        next('/login');
    } else {
        next();
    }
});

export default router;

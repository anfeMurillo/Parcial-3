import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

// Tienda de autenticación usando Pinia
export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || '');
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

    // Establecer estado de autenticación
    function setAuth(newToken: string, newUser: any) {
        token.value = newToken;
        user.value = newUser;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    }

    // Cerrar sesión
    function logout() {
        token.value = '';
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    }

    return { token, user, setAuth, logout };
});

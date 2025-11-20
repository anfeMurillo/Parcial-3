<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <RouterLink to="/" class="flex-shrink-0 flex items-center font-bold text-xl text-indigo-600">
              TicketFlow
            </RouterLink>
          </div>
          <div class="flex items-center space-x-4">
            <RouterLink to="/" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Inicio</RouterLink>
            <template v-if="authStore.token">
              <RouterLink to="/my-tickets" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Mis Entradas</RouterLink>
              <button @click="logout" class="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">Cerrar Sesión</button>
            </template>
            <template v-else>
              <RouterLink to="/login" class="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Iniciar Sesión</RouterLink>
              <RouterLink to="/register" class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Registrarse</RouterLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>

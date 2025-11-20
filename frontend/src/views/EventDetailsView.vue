<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

import { API_URL } from '../config';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const event = ref<any>(null);
const ticketCount = ref(1);
const error = ref('');
const success = ref('');

onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/events/${route.params.id}`);
    event.value = response.data;
  } catch (err) {
    console.error('Error fetching event:', err);
  }
});

const buyTickets = async () => {
  if (!authStore.token) {
    router.push('/login');
    return;
  }

  try {
    await axios.post(`${API_URL}/bookings`, {
      eventId: event.value.id,
      ticketCount: ticketCount.value,
    });
    success.value = '¡Boletos comprados exitosamente!';
    error.value = '';
    // Refresh event data to update available seats
    const response = await axios.get(`${API_URL}/events/${route.params.id}`);
    event.value = response.data;
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Compra fallida';
    success.value = '';
  }
};
</script>

<template>
  <div v-if="event" class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Detalles del Evento</h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">{{ event.title }}</p>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Descripción</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ event.description }}</dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Fecha</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ event.date }}</dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Ubicación</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ event.location }}</dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Precio por boleto</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${{ event.price }}</dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Asientos Disponibles</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ event.availableSeats }}</dd>
        </div>
      </dl>
    </div>
    
    <div class="px-4 py-5 sm:px-6 border-t border-gray-200">
      <div class="flex items-center space-x-4">
        <label for="tickets" class="block text-sm font-medium text-gray-700">Número de boletos:</label>
        <input type="number" id="tickets" v-model="ticketCount" min="1" :max="event.availableSeats" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md">
        <button @click="buyTickets" :disabled="event.availableSeats === 0" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
          {{ event.availableSeats === 0 ? 'Agotado' : 'Comprar Boletos' }}
        </button>
      </div>
      <p v-if="success" class="mt-2 text-sm text-green-600">{{ success }}</p>
      <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
    </div>
  </div>
</template>
